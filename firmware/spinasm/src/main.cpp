#include <Arduino.h>
#include "programmer.h"

#define DATA_ADDR 0x50

Programmer prog0;

void setup() 
{
    prog0.programmerSetup();
}

void loop() 
{
    prog0.processSerialInput();
    prog0.executeOrder();
}