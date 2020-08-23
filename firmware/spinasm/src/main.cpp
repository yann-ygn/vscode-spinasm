#include <Arduino.h>
#include "programmer.h"

Programmer prog0;

void setup() 
{
    Serial.begin(115200);
    prog0.programmerSetup();
}

void loop() 
{
    prog0.processSerialInput();
    prog0.executeOrder();
}