#include <Arduino.h>
#include <E24.h>

#define DATA_ADDR 0x50

E24 e24 = E24(E24Size_t::E24_32K, E24_DEFAULT_ADDR);

void setup() {
    Serial.begin(31250);
    Wire.begin();
    //write two arbitrary bytes
    e24.write(DATA_ADDR, 10);
    e24.write(DATA_ADDR + 1, 20);

    //read the first byte
    uint8_t first = e24.read(DATA_ADDR);
    //read the next byte
    uint8_t second = e24.read();
  Serial.println(second);
}

void loop() {}