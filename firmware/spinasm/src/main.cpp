#include <Arduino.h>
#include "programmer.h"

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