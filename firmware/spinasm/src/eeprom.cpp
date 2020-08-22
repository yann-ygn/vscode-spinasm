#define DEBUG 1

#include <Arduino.h>
#include <I2C.h>
#include "eeprom.h"

void Eeprom::eepromSetup()
{
    I2c.setSpeed(0);
    I2c.pullup(0);
    I2c.begin();
}

bool Eeprom::available()
{
    uint8_t status = 255;
    status = I2c.present(m_address);

    #ifdef DEBUG
        Serial.println(status);
    #endif

    if (status)
    {
        return false;
    }
    else
    {
        return true;
    }
    
}

bool Eeprom::busy()
{

}

void Eeprom::eepromScan()
{
    I2c.scan();
}