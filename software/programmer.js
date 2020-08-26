const fs = require("fs");

class Programmer {
    constructor(serial, folder) {
        this.serialPort = serial;
        this.outputFolder = folder;
    }

    readIntelHexData(file) {
        if (fs.existsSync(file))
        {
            try {
                let data = fs.readFileSync(file, {
                    encoding: 'utf8'
                });

                let lines = data.split(/\r\n|\r|\n/);
                let test = [];

                lines.forEach(line => {
                    let startCode = line.substr(0, 1);
                    let byteCount = parseInt(line.substr(1, 2), 16);
                    let recordType = parseInt(line.substr(7, 2), 16);
                    //let checksum = parseInt(line.substr(17, 2), 16);
                    
                    if (startCode == ':' && byteCount == 0 && recordType == 1) { // Address offset record
                        let address = parseInt(line.substr(3, 4), 16);
                        test.unshift(address);
                    }

                    if (startCode == ':' && byteCount == 4 && recordType == 0) { // Data record
                        for (let i = 9; i < 9 + (byteCount * 2); i = i + 2) {
                            let dataByte = parseInt(line.substr(i, 2), 16);
                            test.push(dataByte); 
                        }
                    }
                });

                return test;
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