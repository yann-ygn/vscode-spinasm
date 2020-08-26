const fs = require("fs");
const ini = require("ini");
const utils = require('./utils.js');

class Config {
    constructor(file) {
        this.iniFile = file;
        this.config;
    }

    readConfigFile() {

        if (fs.existsSync(this.iniFile)) {
            this.config = ini.parse(fs.readFileSync(this.iniFile, 'utf-8'));
        }
        else {
            throw "Ini file not found";
        }
    }

    readCompilerCommand() {

        this.readConfigFile();
    
        let compilerCommand;
        let strComp = (this.config.asfv1.path.trim()); // Read the compiler executable path

        if (fs.existsSync(strComp)) {
            compilerCommand = utils.sanitizePath(strComp);

            let strCompOpt = this.config.asfv1.options.trim(); // Read the compiler options
            if (strCompOpt && strCompOpt.match("(\ ?(-q|-c|-s))*")) { // Check if it's valid and save it
                compilerCommand = compilerCommand + " " + strCompOpt;
            }

            return compilerCommand;
        }

        else {
            throw new Error("Invalid compiler path");
        }
    }

    readSerialPort() {

        this.readConfigFile();

        let port = (this.config.serial.port.trim());

        if (port) {
            return port;
        }
        else {
            throw new Error("Invalid serial port set");
        }
    }
}

module.exports = Config;