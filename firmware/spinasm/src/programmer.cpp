#include <Arduino.h>
#include "programmer.h"
#include "eeprom.h"

Eeprom eeprom0(0x50);

void Programmer::programmerSetup()
{
    Serial.begin(115200);
}

void Programmer::processSerialInput()
{
    if (Serial.available() >= 1)
    {
        if (! m_newOrder) // No current order being processed
        {        
            m_currentOrder = Serial.read(); // Set the current order
            m_newOrder = true; // Set the trigger
        }
        else
        {
            if (m_currentOrder == read && ! m_addressReceived ||
            m_currentOrder == write && ! m_addressReceived)
            {
                m_address = Serial.read();
                m_addressReceived = true;
            }
            else if (m_currentOrder == write && m_addressReceived && ! m_dataReceived)
            {
                if (Serial.available() == 32)
                {
                    for (uint8_t i = 0; i < 32; i++)
                    {
                        m_data[i] = Serial.read();
                    }

                    m_dataReceived = true;
                }
            }
            else
            {
                Serial.println("Unknown status"); // WTF case
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
            if (eeprom0.available())
            {
                Serial.print(ok); // Answer
            }
            else
            {
                Serial.println(nok);
            }
            
            m_currentOrder = none; // Reset the current order
        }
        else if (m_currentOrder == ruready)
        {
            Serial.print(ok); // Answer
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
        else
        {
            Serial.println("Unknown order code"); // WTF case
        }

        m_newOrder = false; // Reset the trigger
    }
    else if (m_currentOrder == write && m_addressReceived || // Write order and address set
    m_currentOrder == read && m_addressReceived) // Read order and address set
    {
        Serial.print(ok); // Answer
    }
    else if (m_currentOrder == write && m_addressReceived && m_dataReceived) // Everything set, trigger the write order
    {
        
    }
    
}