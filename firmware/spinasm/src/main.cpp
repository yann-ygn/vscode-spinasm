#define DEBUG 1

#include <Arduino.h>
#include "programmer.h"
#include "eeprom.h"

//Programmer prog0;
Eeprom eeprom0(0x50);

void setup() 
{
    Serial.begin(115200);
    //prog0.programmerSetup();
    eeprom0.eepromSetup();
    if (eeprom0.available())
    {
        Serial.println("prout available");
    }
    else
    {
        Serial.println("prout unavailable");
    }
    
}

void loop() 
{
    //prog0.processSerialInput();
    //prog0.executeOrder();
}