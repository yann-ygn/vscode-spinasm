#include <Arduino.h>

#ifndef PROGRAMMER_H
#define PROGRAMMER_H

enum orders
{
    none = 0,
    ruthere = 1, // Programmer present
    ruready = 2, // Programmer ready/busy
    nok = 98,
    ok = 99
};

class Programmer
{
    private:
        bool m_busy = false; // Is the programmer busy
        bool m_newOrder = false;
        uint8_t m_currentOrder = 0; // Current order being processed
        bool m_newMessage = false;
        uint8_t m_currentMessage = 0; // Current serial message to process

    public:
        void programmerSetup();

        void processSerialInput();

        void executeOrder();
};

#endif