const fs = require("fs");
const sp = require('serialport');
const bl = require('@serialport/parser-byte-length')
const Logs = require('./logs.js');

/**
 * @brief A programmer can read compiled program files and send the data to the eeprom via an usb adapter
 */
class Programmer {
    constructor(port, baud) {
        this.serialPortPort = port;
        this.serialPortBaud = baud;
        this.serialPort = new sp(port, {
            baudRate: baud,
            autoOpen: false
        });
        this.startMarker = 0x1E;
        this.endMarker = 0x1F;
    }

    /**
     * @brief Check id the passed parameter match the curent serial port settings, recreate an object if they have changed
     * @param {*} port
     * @param {*} baud
     */
    programmerSetup(port, baud) {
        try {
            if (this.serialPortPort != port || this.serialPortBaud != baud) { // Port or baudrate changed in the configuration
                Logs.log(0, "Programmer configuration change, recreating port");
                this.serialPortPort = port;
                this.serialPortBaud = baud;
                this.serialPort = new sp(port, {
                    baudRate: baud,
                    autoOpen: false
                });
            }
            else { // No change
                Logs.log(0, "No programmer configuration change");
            }

            Logs.log(0, "Programmer port : " + this.serialPortPort);
            Logs.log(0, "Programmer baud rate : " + this.serialPortBaud);
        }
        catch (error) {
            throw error;
        }
    }

    async checkProgrammer() {
        try {
            Logs.log(0, "Opening serial port");
            await this.openSerialPort().catch(error => { throw error });

            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3); // Order buffer
                let result = Buffer.alloc(1); // Response buffer
                data[0] = this.startMarker; // Start marker
                data[1] = 0x01; // ruthere
                data[2] = this.endMarker; // End marker

                result = await this.writeBufferReadBuffer1(data); // Write data and await 1 byte answer

                if (result[0] == 99) { // 99 -> OK
                    Logs.log(0, "Programmer connected and EEPROM ready");
                }
                else if (result[0] == 98) {
                    Logs.log(0, "Programmer connected but EEPROM is not ready");
                }
                else {
                    Logs.log(0, "Programmer connected but invalid response : " + result[0]);
                }

                this.disconnectProgrammer();
            }
            else {
                throw new Error("Port not open");
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @brief Open the serial port, send a ruthere order and process the answer
     */
    async connectProgrammer() {
        try {
            Logs.log(0, "Opening serial port");
            await this.openSerialPort().catch(error => { throw error });

            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3); // Order buffer
                let result = Buffer.alloc(1); // Response buffer
                data[0] = this.startMarker; // Start marker
                data[1] = 0x01; // ruthere
                data[2] = this.endMarker; // End marker

                result = await this.writeBufferReadBuffer1(data); // Write data and await 1 byte answer

                if (result[0] == 99) { // 99 -> OK
                    return true;
                }
                else {
                    this.disconnectProgrammer();
                    throw new Error("Programmer connected but EEPROM not ready");
                }
            }
            else {
                throw new Error("Error opening port");
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * @brief Close the serial port
     */
    async disconnectProgrammer() {
        try {
            if (this.serialPort.isOpen) {
                await this.closeSerialPort().catch(error => { throw error });
                Logs.log(0, "Disconnecting programmer on port : " + this.serialPort.path);
                Logs.log(0, "Programmer disconnected");
            }
            else {
                throw new Error("Port already closed")
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @brief Send a write order and process the answer
     */
    async sendWriteOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3); // Order buffer
                let result = Buffer.alloc(1); // Response buffer
                data[0] = this.startMarker; // Start marker
                data[1] = 0x04; // write
                data[2] = this.endMarker; // End marker

                result = await this.writeBufferReadBuffer1(data); // Write data and await 1 byte answer

                if (result[0] == 99) { // 99 -> OK
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

    /**
     * @brief Send a read order and process the answer
     */
    async sendReadOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3); // Order buffer
                let result = Buffer.alloc(1); // Response buffer
                data[0] = this.startMarker; // Start marker
                data[1] = 0x03; // read
                data[2] = this.endMarker; // End marker

                result = await this.writeBufferReadBuffer1(data); // Write data and await 1 byte answer

                if (result[0] == 99) { // 99 -> OK
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

    /**
     * @brief Send a end order and process the answer
     */
    async sendEndOrder() {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(3); // Order buffer
                let result = Buffer.alloc(1); // Response buffer
                data[0] = this.startMarker; // Start marker
                data[1] = 0x05; // end
                data[2] = this.endMarker; // End marker

                result = await this.writeBufferReadBuffer1(data); // Write data and await 1 byte answer

                if (result[0] == 99) { // 99 -> OK
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

    /**
     * @brief Send the address to read to and process the answer
     */
    async sendAddress(address) {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(4); // Order buffer
                let result = Buffer.alloc(1); // Response buffer
                data[0] = this.startMarker; // Start marker
                data[1] = (address >> 8) & 0xFF; // Address HB
                data[2] = address & 0xFF; // Address LB
                data[3] = this.endMarker; // End marker

                result = await this.writeBufferReadBuffer1(data); // Write data and await 1 byte answer

                if (result[0] == 99) {  // 99 -> OK
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

    /**
     * @brief Trigger a page read at the given address and return 32 bytes of data
     */
    async triggerReadPage(address) {
        try {
            if (this.serialPort.isOpen) {
                let data = Buffer.alloc(4); // Order buffer
                data[0] = this.startMarker; // Start marker
                data[1] = (address >> 8) & 0xFF; // Address HB
                data[2] = address & 0xFF; // Address LB
                data[3] = this.endMarker; // End marker

                let result = Buffer.alloc(32); // Respose buffer

                result = await this.writeBufferReadBuffer32(data); // Write data and await 32 bytes answer

                return result;
            }
            else {
                throw new Error("Port not open");
            }
        }
        catch (error) {
            throw error.message;
        }
    }

    /**
     * @brief Write a 512 bytes program to the eeprom
     * @param {Buffer} data 512 bytes buffer
     * @param {Number} address Offset address
     */
    async writeProgram(data, address) {
        try {
            if (this.serialPort.isOpen) {

                let buffer = Buffer.alloc(34); // Page buffer
                let result = Buffer.alloc(1); // Response buffer

                if (await this.sendWriteOrder()) {
                    for (let i = address; i < (address + 512); i = (i + 32)) { // Process by page of 32 bytes
                        //console.log(address);

                        if (await this.sendAddress(i)) { // The address was transmitted successfuly

                            buffer[0] = this.startMarker; // Start marker
                            data.copy(buffer, 1, i - address, (i - address) + 32); // Buffer a page
                            buffer[33] = this.endMarker; // End marker

                            result = await this.writeBufferReadBuffer1(buffer).catch(error => { throw new Error(error.message) }); // Write it

                            if (result[0] == 98) { // Error writing
                                throw new Error("Error writing page : " + i);
                            }
                        }
                        else { // Error transmitting the address
                            throw new Error('Error transmitting the address');
                        }
                    }

                    if (await this.sendEndOrder()) {
                        return true;
                    }
                    else {
                        throw new Error('Error sending the end order');
                    }
                }
                else {
                    throw new Error('Error sending the write order');
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

    /**
     * @brief Read a 512 bytes program from the eeprom and returns it as a buffer
     * @param {Number} address Offset address
     */
    async readProgram(address) {

        let buffer = Buffer.alloc(512); // Data buffer to return

        if (await this.sendReadOrder()) {
            for (let i = address; i < (address + 512); i = (i + 32)) { // Read by page od 32 bytes

                let data = Buffer.alloc(32); // Temp buffer
                data = await this.triggerReadPage(i); // Read a page
                data.copy(buffer, i - address, 0, 32); // Copy it to the buffer
            }

            if (await this.sendEndOrder()) {
                return buffer;
            }
            else {
                throw new Error('Error sending the end order');
            }
        }
        else {
            throw new Error("Error sendig the read order");
        }
    }

    /**
     * @brief Connect to the programmer, write a program, read the written data and compare both to check everything went well
     * @param {Number} program Program #
     * @param {Number} address Address offset
     * @param {Buffer} data 512 bytes program
     */
    async uploadProgram(program, address, data) {
        try {
            Logs.log(0, 'Serial port : ' + this.serialPort.path);

            Logs.log(0, "Connecting to programmer on port : " + this.serialPort.path);
            if (await this.connectProgrammer()) { // Connect to the programmer
                Logs.log(0, "Programmer connected");

                Logs.log(0, "Writing program : " + program);
                if (await this.writeProgram(data, address)) { // Write the data
                    Logs.log(0, "Write successfull");

                    Logs.log(0, "Reading program : " + program);
                    let resultBuffer = Buffer.alloc(512);
                    resultBuffer = await this.readProgram(address); // Read the written data

                    let result = Buffer.compare(data, resultBuffer); // Comparison result

                    //console.log(data.toString('hex'));
                    //console.log(resultBuffer.toString('hex'));

                    Logs.log(0, "Verifying...");
                    if (result == 0) { // 0 -> OK
                        Logs.log(0, "Verification sucess");
                    }
                    else {
                        this.closeSerialPort();
                        throw new Error("Verification failed");
                    }
                }
                else {
                    throw new Error("Write failed");
                }

                await this.disconnectProgrammer()
            }
        }
        catch (error) {
            Logs.log(1, error.message);
        }
    }

    /**
     * @brief Returns a promise that resolves when the serial port is opened
     */
    openSerialPort() {
        return new Promise((resolve, reject) => {
            this.serialPort.open();
            this.serialPort.on('open', () => {
                resolve();
            });

            this.serialPort.on('error', (error) => {
                reject(error.message);
            });
        });
    }

    /**
     * @brief Returns a promise that resolves when the serial port is closed
     */
    closeSerialPort () {
        return new Promise((resolve, reject) => {
            this.serialPort.close();
            this.serialPort.on('close', () => {
                resolve();
            });

            this.serialPort.on('error', (error) => {
                reject(error.message);
            });
        });
    }

    /**
     * @brief Returns a promise that resolves when 1 byte of data is received
     * @param {Buffer} data
     */
    writeBufferReadBuffer1(data) {
        const parser = this.serialPort.pipe(new bl({length: 1}))

        const timeout = new Promise((resolve, reject) => {
            const tm = setTimeout(() => {
                clearTimeout(tm);
                reject('Timeout');
            }, 500);
        });

        const returnData = new Promise((resolve, reject) => {
            this.serialPort.write(data);
            parser.on('data', (response) => {
                resolve(response);
            });

            this.serialPort.once('error', (err) => {
                reject(err);
            });
        });

        return Promise.race([returnData, timeout]);
    }

    /**
     * @brief Returns a promise that resolves when 32 bytes of data are received
     *
     * @param {Buffer} data
     */
    writeBufferReadBuffer32(data) {
        //console.log(data.toString());
        const parser = this.serialPort.pipe(new bl({length: 32}))
        return new Promise((resolve, reject) => {
            this.serialPort.write(data);
            parser.on('data', (response) => {
                //console.log(response.toString());
                resolve(response);
            });

            this.serialPort.once('error', (err) => {
                reject(err);
            });
        });
    }

    /**
     * @brief Read a compiled program and returns a 512 bytes buffer to write to the eeprom
     * @param {*} file Path of the file to read
     */
    readIntelHexData(file) {
        if (fs.existsSync(file))
        {
            try {
                let data = fs.readFileSync(file, {
                    encoding: 'utf8'
                });

                let lines = data.split(/\r\n|\r|\n/); // Split by lines
                let returnObject = {
                    address: parseInt(lines[0].substr(3, 4), 16), // Start write address
                    offset: 0,
                    data: Buffer.alloc(512)
                }

                lines.forEach(line => {
                    let startCode = line.substr(0, 1);
                    let byteCount = parseInt(line.substr(1, 2), 16);
                    let recordType = parseInt(line.substr(7, 2), 16);

                    if (startCode == ':' && byteCount == 4 && recordType == 0) { // Data record
                        for (let i = 9; i < 9 + (byteCount * 2); i = i + 2) { // 4 bytes by data record, one byte is 2 character (base 16)
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