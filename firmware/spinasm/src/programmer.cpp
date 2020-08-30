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
    resetBuffer(); // Reset the buffer after a cycle

    while (Serial.available() > 0 && ! m_newData) // Data available on the serial port
    {
        delay(1);
        m_currentChar = Serial.read();

        if (m_receiveInProgress)
        {
            if (m_currentChar != m_endMarker) // Data to bufffer
            {
                m_data[m_index] = m_currentChar;
                m_index ++;
                m_dataBytes = m_index;
            }
            else // End received
            {
                m_newData = true;
                m_receiveInProgress = false;
            }
        }

        else if (m_currentChar == m_startMarker) // Start received
        {
            m_receiveInProgress = true;
        }
    }

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
                    m_response[0] = nok;
                    Serial.write(m_response, 1);

                    m_error = true;
                }
            }

            else // Invalid message received, trigger an error
            {
                m_response[0] = nok;
                Serial.write(m_response, 1);

                m_error = true;
            }
        }
        
        else // There is a current order being processed
        {
            if (m_currentOrder == write && ! m_addressSet) // Write order but no address set
            {
                if (m_dataBytes == 2) // Awaiting 2 address byte
                {
                    m_addressReceived = true; // Set the trigger
                }

                else // Invalid message received, trigger an error
                {
                    m_response[0] = nok;
                    Serial.write(m_response, 1);

                    m_error = true;
                }
            }

            else if (m_currentOrder == write && m_addressSet && ! m_dataReceived) // Write order, address set but no data received
            {
                if (m_dataBytes == 1) // Only 1 byte available is an end write order
                {
                    m_currentMessage = m_data[0]; // Read the message

                    if (m_currentMessage == end) // End write message
                    {
                        m_currentOrder = m_currentMessage; // Save the current oder
                        m_newOrder = true; // Set the trigger
                    }

                    else // Unexpected message, trigger an error
                    {
                        m_response[0] = nok;
                        Serial.write(m_response, 1);

                        m_error = true;
                    }
                }

                else if (m_dataBytes == 2) // New address to write to received
                {
                    m_addressSet = false;
                    m_addressReceived = true;
                }


                else if (m_dataBytes == 32) // Page to write
                {
                    m_dataReceived = true; // Set the write trigger
                }

                else // Unexpected message, trigger an error
                {
                    m_response[0] = nok;
                    Serial.write(m_response, 1);

                    m_error = true;
                }
            }

            else if (m_currentOrder == read && ! m_addressSet) // Read order but no address set
            {
                if (m_dataBytes == 2) // 2 bytes is an address byte
                {
                    m_addressReceived = true; // Set the trigger
                }

                else if (m_dataBytes == 1) // Only 1 byte available is an end write order
                {
                    m_currentMessage = m_data[0]; // Read the message

                    if (m_currentMessage == end) // End write message
                    {
                        m_currentOrder = m_currentMessage; // Save the current oder
                        m_newOrder = true; // Set the trigger
                    }

                    else // Unexpected message, trigger an error
                    {
                        m_response[0] = nok;
                        Serial.write(m_response, 1);

                        m_error = true;
                    }
                }

                else // Invalid message received, trigger an error
                {
                    m_response[0] = nok;
                    Serial.write(m_response, 1);

                    m_error = true;
                }
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
                m_response[0] = ok;
                Serial.write(m_response, 1);
            }

            else // Eeprom unavailable
            {
                m_response[0] = nok;
                Serial.write(m_response, 1);

                m_error = true;
            }
            
            m_currentOrder = none; // Reset the current order
        }

        else if (m_currentOrder == read)
        {
            m_response[0] = ok;
            Serial.write(m_response, 1);

            m_addressReceived = false;
            m_addressSet = false;
            m_dataExpected = false;
        }

        else if (m_currentOrder == write)
        {
            m_response[0] = ok;
            Serial.write(m_response, 1);

            m_addressReceived = false;
            m_addressSet = false;
            m_dataReceived = false;
        }

        else if (m_currentOrder == end)
        {
            m_response[0] = ok;
            Serial.write(m_response, 1);

            m_currentOrder = none; // Reset the current order
            m_address = 0;
            m_addressSet = false; // Reset the trigger
        }

        else
        {
            Serial.println("Unknown order code"); // WTF case
        }

        m_newOrder = false; // Reset the trigger
    }

    else if (m_currentOrder == write && ! m_addressSet && m_addressReceived) // Write order and address received
    {
        uint8_t highByte = m_data[0]; // Receive HB
        uint8_t lowByte = m_data[1]; // Receive LB
        m_address = (highByte << 8) + lowByte; // Form the address

        m_addressSet = true; // Set the trigger

        m_response[0] = ok;
        Serial.write(m_response, 1);
        m_addressReceived = false;
    }

    else if (m_currentOrder == write && m_addressSet && m_dataReceived) // Everything set, trigger the write order
    {
        while (eeprom0.eepromBusy()) { } // Wait for the previous operation to complete

        m_length = 32;

        uint8_t result = eeprom0.writeArray(m_address, m_data, m_length); // Write the eeprom and get the result

        if (result == 0) // Write ok
        {
            m_response[0] = ok;
            Serial.write(m_response, 1);
        }
        
        else // Write failed
        {
            m_response[0] = nok;
            Serial.write(m_response, 1);

            m_error = true;
        }

        m_dataReceived = false;
    }

    else if (m_currentOrder == read && ! m_addressSet && m_addressReceived) // Read order and address received
    {
        uint8_t highByte = m_data[0]; // Receive HB
        uint8_t lowByte = m_data[1]; // Receive LB
        m_address = (highByte << 8) + lowByte; // Form the address

        m_addressSet = true; // Set the trigger
        
        m_addressReceived = false;
    }

    else if (m_currentOrder == read && m_addressSet)
    {
        while (eeprom0.eepromBusy()) { } // Wait for the previous operation to complete

        m_length = 32;

        eeprom0.readArray(m_address, m_data, m_length);

        Serial.write(m_data, m_length);

        m_addressSet = false;
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
        m_dataExpected = false;

        m_error = false;
    }
}

void Programmer::resetBuffer()
{
    for (uint8_t i = 0; i < sizeof(m_data); i++)
    {
        m_data[i] = 0;
    }

    for (uint8_t i = 0; i < sizeof(m_response); i++)
    {
        m_response[i] = 0;
    }

    m_newData = false;
    m_receiveInProgress = false;
    m_index = 0;
    m_dataBytes = 0;
    m_currentChar = 0;
    m_length = 0;
}