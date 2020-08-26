const fs = require("fs");
const path = require("path");
const utils = require('./utils.js');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Project {
    constructor(folder) {
        this.rootFolder = folder;
        this.outputFolder = path.join(this.rootFolder, "output");
        this.iniFilePath = path.join(this.rootFolder, 'settings.ini');
        this.programs = [];
    }

    createProjectStructure() {
        
        // Program content
        const programContent = ";Blank program";

        // .ini file
        const iniFileContent = 
`;Project config file

[asfv1]
;Path of the executable
path = C:\\Users\\Yann\\.platformio\\python37\\Scripts\\asfv1.exe

;Compiler options separated by a space :
; -c 	clamp out of range values without error
; -s 	read literals 2,1 as float (SpinASM compatibility)
; -q 	suppress warnings
options = -s

[serial]
;Serial port for the programmer
port = COM6
`
        
        for (let i = 0; i < 8; i++) {
            let folder = path.join(this.rootFolder, "bank_" + i);
            let file = path.join(folder, i + "_programName.spn");
    
            if (! fs.existsSync(folder)) { // Folder doesn't exist
                try {
                    fs.mkdirSync(folder) // Bank folder
                }
                catch (err) {
                    throw 'Error creating ' + folder + ' : ' + err.message;
                }
                
                try {
                    fs.writeFileSync(file, programContent) // Blank program file
                }
                catch (err) {
                    throw 'Error creating ' + file + ' : ' + err.message;
                }
            }
            else { // Folder exists
                let programFile = fs.readdirSync(folder).filter(str => str.match("^[0-7].*\.spn")).toString(); // Look for existing program file
    
                if (! programFile) { // Nothig found, create a blank file
                    try {
                        fs.writeFileSync(file, programContent) // Blank program file
                    }
                    catch (err) {
                        throw 'Error creating ' + file + ' : ' + err.message;
                    }
                }
            }
        }
        
        if (! fs.existsSync(this.outputFolder)) { // Output folder doesn't exist
            try {
                fs.mkdirSync(this.outputFolder) // Create output folder folder
            }
            catch (err) {
                throw 'Error creating ' + this.outputFolder + ' : ' + err.message;
            }
        }

        if(! fs.existsSync(this.iniFilePath)) // Init file doesn't exist
        {
            try {
                fs.writeFileSync(this.iniFilePath, iniFileContent) // Create blank ini file
            } catch (err) {
                throw 'Error creating ' + this.iniFilePath + ' : ' + err.message;
            }
        }
    }

    getAvailablePrograms() {
        // Reset the program array
        this.programs = [];
        
        // Iterate thu the 8 programs folders to find the programs
        for (var i = 0; i < 8; i++) {
            // Get the current folder
            let currentProgramFolder = path.join(this.rootFolder, 'bank_' + i.toString());

            // Look for a program file in the current folder
            let programFile = fs.readdirSync(currentProgramFolder).filter(str => str.match("^[0-7].*\.spn")).toString();

            // Add it to the array if it exists
            if (programFile) {					
                let strProg = path.join(currentProgramFolder, programFile).toString();

                this.programs[i] = utils.sanitizePath(strProg);			
            }
            else {
                this.programs[i] = null;
            }
        }
    }
    /**
     * @brief Delete the .hex programs from the fs
     */
    removeHexPrograms() {

        for (let i = 0; i < 8; i++) {
            let file = path.join(this.outputFolder, "output_" + i + ".hex")

            if (fs.existsSync(file)) {
                try {
                    fs.unlinkSync(file);
                }
                catch(err) {
                    throw 'Error removing ' + file + ' : ' + err.message;
                }
            }
        }
    }

    /**
     * @brief Remove a selected program from the fs
     * 
     * @param {*} program 
     */
    removeHexProgram(program) {
        
        let file = path.join(this.outputFolder, "output_" + program + ".hex");

        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
            }
            catch(err) {
                throw 'Error removing ' + file + ' : ' + err.message;
            }
        }
    }

    /**
     * @brief Remove the .bin programs from the fs
     */
    removeBinPrograms() {

        let file = path.join(this.outputFolder, "output.bin");

        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
            }
            catch(err) {
                throw 'Error removing ' + file + ' : ' + err.message;
            }
        }
    }
}

module.exports = Project;