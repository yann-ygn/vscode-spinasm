#include <Arduino.h>

#ifndef PROGRAMMER_H
#define PROGRAMMER_H

enum orders
{
    none = 0,
    ruthere = 1, // Programmer present
    ruready = 2, // Programmer ready/busy
    read = 3,
    write = 4,
    end = 5, // End read/write
    nok = 98,
    ok = 99
};

class Programmer
{
    private:
        bool m_busy = false; // Is the programmer busy
        bool m_newOrder = false;
        uint8_t m_currentOrder = 0; // Current order being processed
        uint8_t m_currentMessage = 0; // Current serial message to process
        bool m_addressSet = false;
        bool m_addressReceived = false;
        uint16_t m_address = 0; // Read/Write address
        bool m_dataReceived = false;
        uint8_t m_length = 0;
        bool m_dataExpected = false;
        bool m_error = false;


        bool m_receiveInProgress = false;
        uint8_t m_startMarker = 60;
        uint8_t m_endMarker = 62;
        uint8_t m_currentChar = 0;
        uint8_t m_data[32];
        uint8_t m_response[1];
        uint8_t m_index = 0;
        uint8_t m_dataBytes = 0;
        bool m_newData = false;

        void resetBuffer();

    public:
        void programmerSetup();

        void processSerialInput();

        void executeOrder();
};

#endif