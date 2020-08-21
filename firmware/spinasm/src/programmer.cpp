#include <Arduino.h>
#include "programmer.h"

void Programmer::programmerSetup()
{
    Serial.begin(115200);
}

void Programmer::processSerialInput()
{
    if (Serial.available() >= 1)
    {
        uint8_t message = Serial.read();

        if (! m_newOrder) // No current order being processed
        {        
            m_currentOrder = message; // Set the current order
            m_newOrder = true; // Set the trigger
        }
    }
}

void Programmer::executeOrder()
{
    if (m_newOrder)
    {
        if (m_currentOrder == ruthere)
        {
            Serial.print(ok); // Answer
            m_currentOrder = none; // Reset the current order
        }
        else
        {
            Serial.println("Unknown order code"); // WTF case
        }
        
        m_newOrder = false; // Reset the trigger
    }
}