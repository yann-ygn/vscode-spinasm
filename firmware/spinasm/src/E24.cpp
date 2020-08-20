#include "E24.h"

#define BUFFER_LENGTH 32
#define E24_PAGE_WRITE_CYCLE	5
#define WRITE_BUFFER_LENGTH		BUFFER_LENGTH - 2 //sequential write will fail if using the full TWI BUFFER_LENGTH
#define READ_BUFFER_LENGTH		BUFFER_LENGTH

E24::E24(E24Size_t size, uint8_t deviceAddr = E24_DEFAULT_ADDR)
{
	_deviceAddr = deviceAddr;
	_size = size;
}

E24::~E24() {}

uint16_t E24::sequentialWrite(uint16_t addr, const uint8_t* data, uint16_t length)
{
	Wire.beginTransmission(_deviceAddr);
	Wire.write(highByte(addr));
	Wire.write(lowByte(addr));

	size_t w = Wire.write(data, min(WRITE_BUFFER_LENGTH, length));
	Wire.endTransmission();

	//wait until the full page is being written
	delay(E24_PAGE_WRITE_CYCLE);

	return w;
}

uint16_t E24::sequentialRead(uint16_t addr, uint8_t* data, uint16_t length)
{
	uint8_t offset = 0;

	Wire.beginTransmission(_deviceAddr);
	Wire.write(highByte(addr));
	Wire.write(lowByte(addr));
	Wire.endTransmission();

	Wire.requestFrom(_deviceAddr, min(READ_BUFFER_LENGTH, length));
	while(Wire.available()) data[offset++] = Wire.read();

	return offset;
}

uint8_t E24::read()
{
	Wire.beginTransmission(_deviceAddr);
	Wire.endTransmission();
	Wire.requestFrom(_deviceAddr, (uint8_t)1);
	
	return Wire.read();
}

uint8_t E24::read(uint16_t addr)
{
	Wire.beginTransmission(_deviceAddr);
	Wire.write(highByte(addr));
	Wire.write(lowByte(addr));
	Wire.endTransmission();
	Wire.requestFrom(_deviceAddr, (uint8_t)1);

	return Wire.read();
}

uint16_t E24::read(uint16_t addr, uint8_t* data, uint16_t length)
{
	uint8_t pageSize = E24_PAGE_SIZE(_size);
	uint8_t read = 0;
	uint16_t offset = 0;
	uint8_t bSize = 0;

	do {
		//avoid to overflow max read buffer size
		bSize = min(pageSize, length);

		read = sequentialRead(addr, data + offset, bSize);
		length -= read;
		addr += read;
		offset += read;

	} while (length > 0);

	return offset;
}

void E24::write(uint16_t addr, uint8_t data)
{
	Wire.beginTransmission(_deviceAddr);
	Wire.write(highByte(addr));
	Wire.write(lowByte(addr));
	Wire.write(data);
	Wire.endTransmission();

	//wait until the full page is being written
	delay(E24_PAGE_WRITE_CYCLE);
}

uint16_t E24::write(uint16_t addr, const uint8_t* data, uint16_t length)
{
	uint16_t endAddress = addr + length - 1;
	
	if (endAddress >  E24_MAX_ADDRESS(_size) || endAddress < addr) return -1; //endAddress < addr == overlap => > E24_MAX_ADDRESS for 512k chip

	uint8_t pageSize = E24_PAGE_SIZE(_size);
	uint8_t written = 0;
	uint16_t offset = 0;
	uint8_t bSize = 0;

	do {
		//compute the next buffer size using nextPageAddress - addr
		bSize = ((addr + pageSize) & ~(pageSize - 1)) - addr;
		//avoid to overflow content length & max write buffer size
		bSize = min(min(pageSize, bSize), length);

		written = sequentialWrite(addr, data + offset, bSize);
		length -= written;
		addr += written;
		offset += written;

	} while (length > 0);

	return offset;
}

//at the cost of the local buffer, this version allows to reuse the write implementation
//and can erase the whole chip in one call if needed.
uint16_t E24::fill(uint16_t addr, uint8_t data, uint16_t length) 
{
	uint8_t buffer[WRITE_BUFFER_LENGTH];
	uint16_t written = 0;
	uint16_t offset = 0;
	uint8_t bSize = 0;

	memset(buffer, data, WRITE_BUFFER_LENGTH);

	do {
		bSize = min(WRITE_BUFFER_LENGTH, length);
		written = write(addr, buffer, bSize);
		if(written == -1) break;

		length -= written,
		addr += written;
		offset += written;
	} while(length > 0);

	return offset;
}


