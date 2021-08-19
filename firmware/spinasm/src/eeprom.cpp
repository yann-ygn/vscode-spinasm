#include <Arduino.h>
#include <Wire.h>
#include "eeprom.h"

void Eeprom::eepromSetup()
{
    Wire.setClock(10000);
    Wire.begin();
}

bool Eeprom::eepromAvailable()
{
    uint8_t status = 255;
    Wire.beginTransmission(m_address);
    status = Wire.endTransmission(true);

    if (status)
    {
        return false;
    }
    else
    {
        return true;
    }
}

bool Eeprom::eepromBusy()
{
    uint8_t status = 255;
    uint8_t data[0];
    Wire.beginTransmission(m_address);
    Wire.write(data, 0);
    status = Wire.endTransmission(true);

    if (status)
    {
        return true;
    }
    else
    {
        return false;
    }
}

uint8_t Eeprom::writeByte(uint16_t address, uint8_t data)
{
    uint8_t result = 255;
    Wire.beginTransmission(m_address);
    Wire.write(highByte(address));
    Wire.write(lowByte(address));
    Wire.write(data);
    result = Wire.endTransmission(true);

    return result;
}

uint8_t Eeprom::readByte(uint16_t address)
{
    Wire.beginTransmission(m_address);
    Wire.write(highByte(address));
    Wire.write(lowByte(address));
    Wire.endTransmission(true);

    Wire.requestFrom(m_address, (uint8_t)1, (uint8_t)1);

    uint8_t rdata = 0;
    if (Wire.available() >= 1)
    {
        rdata = Wire.read();
    }

    return rdata;
}

uint8_t Eeprom::writeArray(uint16_t address, uint8_t * data, uint8_t length)
{
    uint8_t result = 255;
    Wire.beginTransmission(m_address);
    Wire.write(highByte(address));
    Wire.write(lowByte(address));
    for (uint8_t i = 0; i < length; i++)
    {
        Wire.write(data[i]);
    }
    result = Wire.endTransmission(true);

    return result;
}

void Eeprom::readArray(uint16_t address, uint8_t * data, uint8_t length)
{
    Wire.beginTransmission(m_address);
    Wire.write(highByte(address));
    Wire.write(lowByte(address));
    Wire.endTransmission(true);

    Wire.requestFrom(m_address, length, (uint8_t)1);

    if (Wire.available() >= length)
    {
        for (uint8_t i = 0; i < length; i++)
        {
            data[i] = Wire.read();
        }
    }
}