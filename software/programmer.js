const fs = require("fs");
const sp = require('serialport');

class Programmer {
    constructor(port) {
        this.serialPort = new sp(port, {
            baudRate: 115200,
            autoOpen: false
        });
    }

    async connectProgrammer() {
        try {
            await this.openSerialPort();

            if (this.serialPort.isOpen) {
                let data = [0x01]; //ruthere

                let result = await this.writeReadSerialPort(data);

                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw "Error opening port";
            }
        } 
        catch (error) {
            throw "Error : " + error.message;
        }
    }

    async disconnectProgrammer() {
        try {
            if (! this.serialPort.isOpen) {
                await this.closeSerialPort();
            }
        } 
        catch (error) {
            throw "Error : " + error.message;
        }
    }

    async sendWriteOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = [0x04]; // Write
    
                let result = await this.writeReadSerialPort(data);
    
                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw "Port not open";
            }
        } 
        catch (error) {
            throw "Error : " + error.message;
        }        
    }

    async sendWriteAddress(address) {
        try {
            if (this.serialPort.isOpen) {
                console.log(address);

                let hb = (address >> 8) & 0xFF;
                let lb = address & 0xFF;
                let data = [];
                data[0] = hb;
                data[1] = lb;

                let result = await this.writeReadArraySerialPort(data);

                if (result == '99') {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw "Port not open";
            }
        }
        catch (error) {
            throw "Error : " + error.message;
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

    writeReadArraySerialPort(data) {
        console.log(data.toString());
        console.log(data.length.toString());
        return new Promise((resolve, reject) => {
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].toString());
                this.serialPort.write(data[i]);
            }

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
                throw "Error : " + error.message;
            }
        }
        else {
            throw "Unable to open file : " + file;
        }
    }
}

module.exports = Programmer;