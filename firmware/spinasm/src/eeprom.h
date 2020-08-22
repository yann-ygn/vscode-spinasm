#include <Arduino.h>

#ifndef EEPROM_H
#define EEPROM_H

class Eeprom
{
    private:
        uint8_t m_address;

        bool busy();

    public:
        Eeprom(uint8_t address) : m_address(address) { }

        void eepromSetup();
        void eepromScan();
        bool available();
};

#endif