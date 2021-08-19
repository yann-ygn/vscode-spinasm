#include <Arduino.h>

#ifndef EEPROM_H
#define EEPROM_H

#define MAX_PAGE_LENGTH 32

class Eeprom
{
    private:
        uint8_t m_address; // i2c

    public:
        Eeprom(uint8_t address) : m_address(address) { }

        /**
         * @brief Setup and initialize the i2c bus
         *
         */
        void eepromSetup();

        /**
         * @brief Poll for the eeprom at the given address to check if it is present
         *
         * @return true if present
         * @return false if not present
         */
        bool eepromAvailable();

        /**
         * @brief Send a blank write command to check if a write operation is still in progress
         *
         * @return true if busy
         * @return false if not busy
         */
        bool eepromBusy();

        /**
         * @brief Write a byte to the given address
         *
         * @param address
         * @param data
         * @return uint8_t 0 on successfull write
         */
        uint8_t writeByte(uint16_t address, uint8_t data);

        /**
         * @brief Read a byte from the given address
         *
         * @param address
         * @return uint8_t
         */
        uint8_t readByte(uint16_t address);

        /**
         * @brief Write an array to the memory
         *
         * @param address
         * @param data
         * @param length
         * @return uint8_t 0 on a successful write
         */
        uint8_t writeArray(uint16_t address, uint8_t * data, uint8_t length);

        /**
         * @brief Read an array from the memory
         *
         * @param address
         * @param data
         * @param length
         */
        void readArray (uint16_t address, uint8_t * data, uint8_t length);
};

#endif