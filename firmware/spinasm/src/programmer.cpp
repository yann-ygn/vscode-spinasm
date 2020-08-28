#include <Arduino.h>
#include "programmer.h"
#include "eeprom.h"

Eeprom eeprom0(0x50);

void Programmer::programmerSetup()
{
    Serial.begin(57600);
    eeprom0.eepromSetup();
}

void Programmer::processSerialInput()
{
    resetBuffer();

    while (Serial.available() > 0 && ! m_newData)
    {
        delay(1);
        m_currentChar = Serial.read();
        //Serial.print(m_currentChar);
        
        if (m_receiveInProgress)
        {
            if (m_currentChar != m_endMarker)
            {
                m_data[m_index] = m_currentChar;
                //Serial.print(1);
                m_index ++;
                m_dataBytes = m_index;
                //Serial.print(m_dataBytes);
            }
            else
            {   
                //Serial.print(0);
                m_newData = true;
                m_receiveInProgress = false;
            }
        }

        else if (m_currentChar == m_startMarker)
        {
            m_receiveInProgress = true;
            //Serial.print(2);
        }
    }

    /**
    if (m_newData)
    {
        Serial.print(0);
        Serial.print(m_data[0]);
    }
    **/
    
    if (m_newData)
    {
        if (m_currentOrder == none) // No current order being processed
        {
            if (m_dataBytes == 1) // Awaiting 1 order byte
            {
                m_currentMessage = m_data[0]; // Read the incoming byte

                if (m_currentMessage == ruthere || m_currentMessage == ruready || m_currentMessage == read ||
                m_currentMessage == write || m_currentMessage == end) // Filter know orders only
                {
                    m_currentOrder = m_currentMessage; // Set the current order
                    m_newOrder = true; // Set the trigger
                }

                else // Invalid order received, trigger an error
                {
                    Serial.print(nok);

                    m_error = true;
                }
            }

            else // Invalid message received, trigger an error
            {
                Serial.print(nok);

                m_error = true;
            }
        }
        
        else // There is a current order being processed
        {
            if ((m_currentOrder == read && ! m_addressSet) || // Read order but no address set
            (m_currentOrder == write && ! m_addressSet)) // Write order but no address set
            {
                if (m_dataBytes == 2) // Awaiting 2 address byte
                {
                    uint8_t highByte = m_data[0]; // Receive HB
                    uint8_t lowByte = m_data[1]; // Receive LB
                    m_address = (highByte << 8) + lowByte; // Form the address

                    m_addressSet = true; // Set the trigger
                    m_addressReceived = true; // Set the trigger
                }

                else // Invalid message received, trigger an error
                {
                    Serial.print(nok);
                    m_error = true;
                }
            }
            
            else if (m_currentOrder == write && m_addressSet && ! m_dataReceived) // Write order, address set but no data received
            {
                if (m_dataBytes == 1) // Only 1 byte available is an end write order
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

                        m_error = true;
                    }
                }

                else if (m_dataBytes == 32) // Page to write
                {
                    m_dataReceived = true; // Set the write trigger
                }

                else // Unexpected message, trigger an error
                {
                    Serial.println(nok);

                    m_error = true;
                }
            }

            else if (m_currentOrder == read && m_addressSet)
            {
                
            }
        }

        m_newData = false;
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
            m_address = 0;
            m_addressSet = false; // Reset the trigger
        }

        else
        {
            Serial.println("Unknown order code"); // WTF case
        }

        m_newOrder = false; // Reset the trigger
    }

    if ((m_currentOrder == write && m_addressSet && m_addressReceived) || // Write order and address set
    (m_currentOrder == read && m_addressSet && m_addressReceived)) // Read order and address set
    {
        Serial.print(ok); // Answer
        m_addressReceived = false;
    }

    if (m_currentOrder == write && m_addressSet && m_dataReceived) // Everything set, trigger the write order
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

            m_error = true;
        }

        m_dataReceived = false;
    }

    if (m_error) // Protocol error, reset everything
    {
        m_currentOrder = none;
        m_newOrder = false;
        m_addressSet = false;
        m_addressReceived = false;
        m_dataReceived = false;
        resetBuffer();
        m_dataBytes = 0;

        m_error = false;
    }
}

void Programmer::resetBuffer()
{
    for (uint8_t i = 0; i < sizeof(m_data); i++)
    {
        m_data[i] = 0;
    }

    m_newData = false;
    m_receiveInProgress = false;
    m_index = 0;
    m_dataBytes = 0;
    m_currentChar = 0;
}