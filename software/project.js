const fs = require("fs");
const path = require("path");
const cp = require('child_process');

const Logs = require('./logs.js');

/**
 * @brief A project is an ensemble of program files that can be compiled into output files ready to be programmed into an eeprom
 */
class Project {
    constructor(folder) {
        this.rootFolder = folder; // Root folder of the project
        this.outputFolder = path.join(this.rootFolder, "output"); // Output folder for the compiled programs
        this.iniFilePath = path.join(this.rootFolder, 'settings.ini'); // Settings file
        this.outputBinFile = path.join(this.outputFolder, "output.bin"); // Output file in .bin format, static name
        this.compiler = ''; // Compiler command line
        this.compilerArguments = []; // Compiler command line arguments
        this.programs = []; // Programs array
        this.outputs = []; // Output files array
    }

    /**
     * @brief Initialize a blank project in the current directory
     */
    createProjectStructure() {
        
        // Blank program content
        const programContent = ";Blank program";

        // Basic .ini file content
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
        // A blank project is 7 banks
        for (let i = 0; i < 8; i++) {
            let folder = path.join(this.rootFolder, "bank_" + i);
            let file = path.join(folder, i + "_programName.spn");

            if (! fs.existsSync(folder)) { // Folder doesn't exist
                try {
                    fs.mkdirSync(folder) // Bank folder
                }
                catch (err) {
                    throw new Error('Could not create ' + folder + ' : ' + err.message);
                }

                try {
                    fs.writeFileSync(file, programContent) // Blank program file
                }
                catch (err) {
                    throw new Error('Could not create ' + file + ' : ' + err.message);
                }
            }
            else { // Folder exists
                let programFile = fs.readdirSync(folder).filter(str => str.match("^[0-7].*\.spn")).toString(); // Look for existing program file

                if (! programFile) { // Nothig found, create a blank file
                    try {
                        fs.writeFileSync(file, programContent) // Blank program file
                    }
                    catch (err) {
                        throw new Error('Could not create ' + file + ' : ' + err.message);
                    }
                }
            }
        }

        if (! fs.existsSync(this.outputFolder)) { // Output folder doesn't exist
            try {
                fs.mkdirSync(this.outputFolder) // Create output folder folder
            }
            catch (err) {
                throw new Error('Could not create ' + this.outputFolder + ' : ' + err.message);
            }
        }

        if(! fs.existsSync(this.iniFilePath)) // Init file doesn't exist
        {
            try {
                fs.writeFileSync(this.iniFilePath, iniFileContent) // Create blank ini file
            } catch (err) {
                throw new Error('Could not create ' + this.iniFilePath + ' : ' + err.message);
            }
        }
    }

    /**
     * @brief Iterate thru the banks folder to find valid program files
     */
    getAvailablePrograms() {
        // Reset the program array
        this.programs = [];

        // Iterate thu the 8 programs folders to find the programs
        for (var i = 0; i < 8; i++) {
            // Get the current folder
            let currentProgramFolder = path.join(this.rootFolder, 'bank_' + i);

            // Look for a program file in the current folder
            let programFile = fs.readdirSync(currentProgramFolder).filter(str => str.match("^[0-7].*\.spn"));

            // Add it to the array if it exists
            if (programFile) {					
                let strProg = path.join(currentProgramFolder, programFile.toString());
                let strOut = path.join(this.outputFolder, path.parse(programFile[0]).name.toString() + '.hex');

                this.programs[i] = strProg;
                this.outputs[i] = strOut;
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

        this.outputs.forEach(output => {
            if (fs.existsSync(output)) {
                try {
                    Logs.log(0, "Removing file : " + output)
                    fs.unlinkSync(output);
                }
                catch(err) {
                    throw new Error('Could not remove ' + output + ' : ' + err.message);
                }
            }
        });
    }

    /**
     * @brief Remove a selected program from the fs
     * 
     * @param {*} program 
     */
    removeHexProgram(program) {

        let file = this.outputs[program];

        if (fs.existsSync(file)) {
            try {
                Logs.log(0, "Removing file : " + file)
                fs.unlinkSync(file);
            }
            catch(err) {
                throw new Error('Could not remove ' + file + ' : ' + err.message);
            }
        }
    }

    /**
     * @brief Remove the .bin programs from the fs
     */
    removeBinPrograms() {

        if (fs.existsSync(this.outputBinFile)) {
            try {
                Logs.log(0, "Removing file : " + this.outputBinFile)
                fs.unlinkSync(this.outputBinFile);
            }
            catch(err) {
                throw new Error('Could not remove ' + this.outputBinFile + ' : ' + err.message);
            }
        }
    }

    /**
     * @brief Initialize the compiler
     * @param {*} compiler Compiler command line
     * @param {Array} compilerArgs Args array
     */
    buildSetup(compiler, compilerArgs) {

        this.compilerArguments = []; // Reset the arg array
        this.compiler = compiler; // Read the compiler command line
        this.compilerArguments = compilerArgs; // Read the args

        Logs.log(0, "Compiler : " + compiler);
        Logs.log(0, "Compiler args : " + compilerArgs.toString());

        Logs.log(0, "Getting available programs");
        this.getAvailablePrograms();

        Logs.log(0, "Available programs :");
        this.programs.forEach(program => {
            Logs.log(0, "Program " + this.programs.indexOf(program) + " : " + program);
        });

        this.outputs.forEach(output => {
            Logs.log(0, "Output " + this.outputs.indexOf(output) + " : " + output);
        });

        Logs.log(0, "Compiler ready");
    }

    /**
     * @brief Run the compiler used the stored command and args
     */
    runCompiler () {

        try {
            let output = cp.spawnSync(this.compiler, this.compilerArguments, {encoding: 'utf8'}); // Sync exec
            
            Logs.log(0, "asfv1 return code : " + output.status)

            if (output.stdout) {
                Logs.log(0, "asfv1 stdout : " + output.stdout)
            }

            if (output.stderr) {
                Logs.log(0, "asfv1 stderr : " + output.stderr)
            }

            return output.status;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * @brief Compile a program to hex
     * @param {Number} program Program #
     */
    compileProgramToHex(program) {

        try {
            this.removeHexProgram(program);

            if (this.programs[program]) {
                this.compilerArguments.push('-p');
                this.compilerArguments.push(program);
                this.compilerArguments.push(this.programs[program].toString());
                this.compilerArguments.push(this.outputs[program].toString());

                let result = this.runCompiler();

                if (result == 0) {
                    Logs.log(0, "Compile succeeded");

                    return result;
                }
                else if (result == 1) {
                    throw new Error("Compile failed");
                }
                else if (result == 2) {
                    throw new Error("Error parsing the args");
                }
                else {
                    throw new Error("Unknown return code : " + result);
                }
            }
        } 
        catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * @brief Compile a program to bin
     * @param {Number} program 
     */
    compileProgramtoBin(program) {
        try {
            if (this.programs[program]) {

                this.compilerArguments.push('-p');
                this.compilerArguments.push(this.programs.indexOf(program));
                this.compilerArguments.push(this.programs[program].toString());
                this.compilerArguments.push(this.outputBinFile.toString());

                let result = this.runCompiler();

                if (result == 0) {
                    Logs.log(0, "Compile succeeded");
                }
                else if (result == 1) {
                    throw new Error("Compile failed");
                }
                else if (result == 2) {
                    throw new Error("Error parsing the args");
                }
                else {
                    throw new Error("Unknown return code : " + result);
                }
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = Project;