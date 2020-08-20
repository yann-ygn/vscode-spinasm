#pragma once

#include <Arduino.h>
#include <Wire.h>

#define E24_DEFAULT_ADDR		0x50
#define E24_MAX_ADDRESS(size)	((static_cast<uint16_t>(1 << static_cast<uint8_t>(size)) * 1024) - 1)
#define E24_PAGE_SIZE(size)		(static_cast<uint8_t>(1 << ((static_cast<uint8_t>(size) + 2) / 2)) * 8)

enum class E24Size_t : uint8_t
{
	E24_8K = 0,
	E24_16K = 1,
	E24_32K = 2,
	E24_64K = 3,
	E24_128K = 4,
	E24_256K = 5,
	E24_512K = 6
};

class E24
{
private:
	uint8_t _deviceAddr;
	E24Size_t _size;

	uint16_t sequentialWrite(uint16_t addr, const uint8_t* data, uint16_t length);
	uint16_t sequentialRead(uint16_t addr, uint8_t* data, uint16_t length);
public:
	E24(E24Size_t size, uint8_t addr = E24_DEFAULT_ADDR);
	~E24();
	
	E24Size_t getSize() { return _size; }

	uint8_t read();
	uint8_t read(uint16_t addr);
	uint16_t read(uint16_t addr, uint8_t* data, uint16_t length);

	void write(uint16_t addr, uint8_t data);
	uint16_t write(uint16_t addr, const uint8_t* data, uint16_t length);

	uint16_t fill(uint16_t addr, uint8_t data, uint16_t length);

	template <typename T> uint16_t readBlock(uint16_t addr, T& data)
	{
		return read(addr, (uint8_t*)&data, sizeof(data));
	}

	template <typename T> uint16_t writeBlock(uint16_t addr, const T& data)
	{
		return write(addr, (const uint8_t*)&data, sizeof(data));
	}
};