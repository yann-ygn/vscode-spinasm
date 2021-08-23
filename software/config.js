const fs = require("fs");
const ini = require("ini");
const utils = require('./utils.js');

class Config {
    constructor(file) {
        this.iniFile = file;
        this.config;
    }

    /**
     * @brief Read the config file passed to the constructor and return an ini object
     */
    readConfigFile() {
        try {
            if (fs.existsSync(this.iniFile)) { // Check if the file exists
                this.config = ini.parse(fs.readFileSync(this.iniFile, 'utf-8')); // Parse the file
            }
            else { // File doesn't exist
                throw new Error("Ini file not found : " + this.iniFile + ', please recreate project');
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @brief Return a sanitized compiler path from the config object
     */
    readCompilerCommand() {
        try {
            this.readConfigFile();

            let compilerCommand;
            let strComp = (this.config.asfv1.path.trim()); // Read the compiler executable path

            if (fs.existsSync(strComp)) {
                compilerCommand = utils.sanitizePath(strComp); // Sanitize the path for Windows systems

                return compilerCommand;
            }
            else {
                throw new Error("Invalid compiler path : " + strComp);
            }
        }
        catch (error) {
            throw error;
        }
    }

    /**
     * @brief Return an array containing the compiler options
     */
    readCompilerArgs() {
        this.readConfigFile();

        try {
            let strCompOpt = this.config.asfv1.options.trim(); // Read the compiler options

            if (strCompOpt && strCompOpt.match("(\ ?(-q|-c|-s))*")) { // Check if it's valid and save it
                let compilerOptions = strCompOpt.split(' ');  // Form the array

                return compilerOptions;
            }
            else {
                throw new Error("Invalid compiler options");
            }
        }
        catch (error) {
            throw error;
        }
    }

    readSerialPort() {
        this.readConfigFile();

        try {
            let port = this.config.serial.port.trim();

            if (port) {
                return port;
            }
            else {
                throw new Error("No serial port set");
            }
        }
        catch (error) {
            throw error;
        }
    }

    readBaudRate() {
        this.readConfigFile();

        try {
            let rate = (this.config.serial.baudrate.trim());

            if (rate) {
                return parseInt(rate, 10);
            }
            else {
                throw new Error("No baud rate set");
            }
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = Config;