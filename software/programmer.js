const fs = require("fs");
const sp = require('serialport');

class Programmer {
    constructor(port) {
        this.serialPort = new sp(port, {
            baudRate: 57600,
            autoOpen: false
        });
        this.program0Address = 0;
    }

    async connectProgrammer() {
        try {
            await this.openSerialPort();

            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3);
                data[0] = 0x3C;
                data[1] = 0x01; // ruthere
                data[2] = 0x3E;

                let result = await this.writeReadSerialPort(data);

                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("Error opening port");
            }
        } 
        catch (error) {
            throw error.message;
        }
    }

    async disconnectProgrammer() {
        try {
            if (! this.serialPort.isOpen) {
                await this.closeSerialPort();
            }
        } 
        catch (error) {
            throw error.message;
        }
    }

    async sendWriteOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3);
                data[0] = 0x3C;
                data[1] = 0x04; // write
                data[2] = 0x3E;
    
                let result = await this.writeReadSerialPort(data);
    
                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("Port not open");
            }
        }
        catch (error) {
            throw error.message;
        }        
    }

    async sendReadOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3);
                data[0] = 0x3C;
                data[1] = 0x03; // read
                data[2] = 0x3E;
    
                let result = await this.writeReadSerialPort(data);
    
                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("Port not open");
            }
        } 
        catch (error) {
            throw error.message;
        }        
    }

    async sendEndOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3);
                data[0] = 0x3C;
                data[1] = 0x05; // end
                data[2] = 0x3E;

                let result = await this.writeReadSerialPort(data);

                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("Port not open");
            }
        } 
        catch (error) {
            throw error.message;
        }        
    }

    async sendAddress(address) {
        try {
            if (this.serialPort.isOpen) {
                console.log(address);

                let data = Buffer.alloc(2);
                data[0] = (address >> 8) & 0xFF;
                data[1] = address & 0xFF;

                let result = await this.writeReadSerialPort(data);

                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("Port not open");
            }
        }
        catch (error) {
            throw error.message;
        }
    }

    async writeProgram(program, data) {
        try {
            //if (this.serialPort.isOpen) {

                let startAddress = 0; // Memory offset to write to
                let buffer = Buffer.alloc(32); // Page buffer
                
                switch (program) {
                    case 0:
                        startAddress = 0;
                        break;
                    
                    case 1:
                        startAddress = 512;
                        break;

                    default:
                        throw new Error("Invalid value");
                }

                for (let i = startAddress; i < (startAddress + 512); i = (i + 32)) { // Process by page of 32 bytes
                    
                    // let addressResult = await this.sendAddress(i); // Send the start address

                    //if (addressResult) { // The address was transmitted successfuly

                        console.log('Offset : ' + i)
                        data.copy(buffer, 0, i, i + 32);

                        for (let j =0; j < 32; j++) {
                            console.log(buffer[j])
                        }

                        //let writeResult = await this.writeReadSerialPort(buffer);

                        /*if (! writeResult) {
                            throw new Error("Error writing page : " + i);
                        }
                    }
                    else { // Error transmitting the address
                        throw new Error('Error transmitting the address')
                    }
                }*/
            }
            /*else {
                throw new Error("Port not open");
            }*/
        }
        catch (error) {
            throw error.message;
        }
    }

    /**
     * @brief Returns a promise that resolves when the port is opened
     */
    openSerialPort() {
        return new Promise((resolve, reject) => {
            this.serialPort.open();
            this.serialPort.on('open', () => {
                console.log('opened');
                resolve();
            });

            this.serialPort.on('error', (err) => {
                reject(err);
            });
        });
    }

    /**
     * @brief Returns a promise that resolves when the port is closed
     */
    closeSerialPort () {
        return new Promise((resolve, reject) => {
            this.serialPort.close();
            this.serialPort.on('close', () => {
                console.log('closed');
                resolve();
            });
    
            this.serialPort.on('error', (err) => {
                reject(err);
            });
        });
    }

    writeReadSerialPort(data) {
        console.log(data.toString());
        return new Promise((resolve, reject) => {
            this.serialPort.write(data);
            this.serialPort.once('data', (response) => {
                console.log(response.toString());
                resolve(response.toString());
            });
    
            this.serialPort.once('error', (err) => {
                reject(err);
            });
        });
    }

    readIntelHexData(file) {
        if (fs.existsSync(file))
        {
            try {
                let data = fs.readFileSync(file, {
                    encoding: 'utf8'
                });

                let lines = data.split(/\r\n|\r|\n/);
                let returnObject = {
                    address: 0,
                    offset: 0,
                    data: Buffer.alloc(512)
                }

                lines.forEach(line => {
                    let startCode = line.substr(0, 1);
                    let byteCount = parseInt(line.substr(1, 2), 16);
                    let recordType = parseInt(line.substr(7, 2), 16);
                    //let checksum = parseInt(line.substr(17, 2), 16);
                    
                    if (startCode == ':' && byteCount == 0 && recordType == 1) { // Address offset record
                        returnObject.address = parseInt(line.substr(3, 4), 16);
                    }

                    if (startCode == ':' && byteCount == 4 && recordType == 0) { // Data record
                        for (let i = 9; i < 9 + (byteCount * 2); i = i + 2) {
                            returnObject.data[returnObject.offset] = parseInt(line.substr(i, 2), 16);

                            returnObject.offset ++;
                        }
                    }
                });

                return returnObject;
            } 
            catch (error) {
                throw error.message;
            }
        }
        else {
            throw new Error("Unable to open file : " + file);
        }
    }
}

module.exports = Programmer;