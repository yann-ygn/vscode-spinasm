#include <Arduino.h>
#include "programmer.h"
#include "eeprom.h"

Eeprom eeprom0(0x50);

void Programmer::programmerSetup()
{
    Serial.begin(115200);
    eeprom0.eepromSetup();
}

void Programmer::processSerialInput()
{
    if (Serial.available() >= 1)
    {
        if (m_currentOrder == none) // No current order being processed
        {
            if (Serial.available() == 1) // Awaiting 1 order byte
            {
                m_currentMessage = Serial.read(); // Read the incoming byte

                if (m_currentMessage == ruthere || m_currentMessage == ruready || m_currentMessage == read || 
                m_currentMessage == write || m_currentMessage == end) // Filter know orders only
                {
                    m_currentOrder = m_currentMessage; // Set the current order
                    m_newOrder = true; // Set the trigger
                }
                else // Invalid order received, trigger an error
                {
                    Serial.println(nok);
                    Serial.println("Unknown order received : " + m_currentMessage);

                    m_error = true;
                }
                
            }
            else // Invalid message received, trigger an error
            {
                Serial.println(nok);
                Serial.println("Expected an order byte, received : " + Serial.readString());

                m_error = true;
            }            
        }
        else
        {
            if ((m_currentOrder == read && ! m_addressReceived) || // Read order but no address set
            (m_currentOrder == write && ! m_addressReceived)) // Write order but no address set
            {
                if (Serial.available() == 2) // Awaiting 2 address byte
                {
                    uint8_t highByte = Serial.read(); // Receive HB
                    uint8_t lowByte = Serial.read(); // Receive LB
                    m_address = (highByte << 8) + lowByte; // Form the address

                    m_addressReceived = true; // Set the trigger
                }
                else // Invalid message received, trigger an error
                {
                    Serial.println(nok);
                    Serial.println("Expected two address byte, received : " + Serial.readString());

                    m_error = true;
                }   
            }
            else if (m_currentOrder == write && m_addressReceived && ! m_dataReceived) // Write order, address set but no data received
            {
                if (Serial.available() <= MAX_PAGE_LENGTH) // Watch for overflows
                {
                    if (Serial.available() == 1) // Only 1 byte available is an end write order
                    {
                        m_currentMessage = Serial.read(); // Read the message

                        if (m_currentMessage == end) // End write message
                        {
                            m_currentOrder = m_currentMessage; // Save the current oder
                            m_newOrder = true; // Set the trigger
                        }
                        else // Unexpected message, trigger an error
                        {
                            Serial.println(nok);
                            Serial.println("Expected end write byte, received : " + m_currentMessage);

                            m_error = true;
                        }                        
                    }
                    else // More than 1 byte available, data to write
                    {
                        resetBuffer(); // Reset the data buffer
                        uint8_t length = Serial.available(); // Get the byte count
                        
                        for (uint8_t i; i < length; i++) // Buffer the data
                        {
                            m_data[i] = Serial.read();
                        }

                        m_dataReceived = true; // Set the write trigger
                    }
                }
                else // Overflow, triger an error
                {
                    Serial.println(nok);
                    Serial.println("Overflow : " + Serial.println());

                    m_error = true;
                }
            }
            else if (m_currentOrder == read && m_addressReceived)
            {
                
            }
            else
            {
                Serial.println("Incoherent status ???"); // WTF case
            }
        }        
    }
}

void Programmer::executeOrder()
{
    if (m_newOrder)
    {
        if (m_currentOrder == ruthere)
        {
            if (eeprom0.eepromAvailable()) // Eeprom available
            {
                Serial.print(ok); 
            }
            else // Eeprom unavailable
            {
                Serial.println(nok);
                Serial.println("Eeprom unavailable");

                m_error = true;
            }
            
            m_currentOrder = none; // Reset the current order
        }

        else if (m_currentOrder == read)
        {
            Serial.print(ok); // Answer
        }

        else if (m_currentOrder == write)
        {
            Serial.print(ok); // Answer
        }

        else if (m_currentOrder == end)
        {
            Serial.print(ok); // Answer
            m_addressReceived = false; // Reset the trigger
            m_dataReceived = false; // Reset the trigger
        }

        else
        {
            Serial.println("Unknown order code"); // WTF case
        }

        m_newOrder = false; // Reset the trigger
    }
    else if ((m_currentOrder == write && m_addressReceived) || // Write order and address set
    (m_currentOrder == read && m_addressReceived)) // Read order and address set
    {
        Serial.print(ok); // Answer
    }
    else if (m_currentOrder == write && m_addressReceived && m_dataReceived) // Everything set, trigger the write order
    {
        while (eeprom0.eepromBusy()) { } // Wait for the previous write to complete

        uint8_t result = eeprom0.writeArray(m_address, m_data, m_length); // Write the eeprom and get the result

        if (result == 0) // Write ok
        {
            Serial.println(ok);
        }
        else // Write failed
        {
            Serial.println(nok);
            Serial.println("Error writing to the eeprom : " + result);

            m_error = true;
        }        
    }

    if (m_error) // Protocol error, reset everything
    {
        m_currentOrder = none;
        m_newOrder = false;
        m_addressReceived = false;
        m_dataReceived = false;
        resetBuffer();

        m_error = false;
    }
}

void Programmer::resetBuffer()
{
    for (uint8_t i = 0; sizeof(m_data); i++)
    {
        m_data[i] = 0;
    }
}