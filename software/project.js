const fs = require("fs");
const path = require("path");
const cp = require('child_process');

const Logs = require('./logs.js');

class Project {
    constructor(folder) {
        this.rootFolder = folder;
        this.outputFolder = path.join(this.rootFolder, "output");
        this.iniFilePath = path.join(this.rootFolder, 'settings.ini');
        this.compiler = '';
        this.compilerArguments = [];
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

                this.programs[i] = strProg;
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
                    Logs.log(0, "Removing file : " + file)
                    fs.unlinkSync(file);
                }
                catch(err) {
                    throw new Error('Could not remove ' + file + ' : ' + err.message);
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

        let file = path.join(this.outputFolder, "output.bin");

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

        Logs.log(0, "Compiler ready");
    }
    
    runCompiler () {

        try {
            let output = cp.spawnSync(this.compiler, this.compilerArguments, {encoding: 'utf8'});
            
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

    compileProgramToHex(program) {

        try {
            this.removeHexProgram(program);

            if (this.programs[program]) {
                this.compilerArguments.push('-p');
                this.compilerArguments.push(program);
                this.compilerArguments.push(this.programs[program].toString());
                this.compilerArguments.push(path.join(this.outputFolder, "program_" + program + ".hex").toString());

                let result = this.runCompiler();

                if (result == 0) {
                    Logs.log(0, "Compile succeeded");
                }

                if (result == 1) {
                    Logs.log(0, "Compile failed");
                }

                if (result == 2) {
                    Logs.log(0, "Wrong arguments");
                }

                return result;
            }
        } 
        catch (error) {
            
        }
    }

    /*
    async runCompiler(command) {

        try {
            const { stdout, stderr } = await exec(command);

            if (stderr) {
                Logs.log(0, "asfv1 stderr : " + stderr);
            }
            if (stdout) {
                Logs.log(0, "asfv1 stdout : " + stdout);
            }
        } 
        catch (err) {
            Logs.log(0, "asfv1 returned an error : " + err.code + err.message);
        }
    }

    compileProgramsToBin(compilerCommand) {

        this.programs.forEach(program => {
            if (program)
            {
                let command =  compilerCommand + ' -p ' + this.programs.indexOf(program) + ' ' + program + ' ' + Utils.sanitizePath(path.join(this.outputFolder, "output.bin"));
                Logs.log(0, "Compiler command : " + command);

                this.runCompiler(command);
            }
        });
    }

    compileProgramToHex(compilerCommand, program) {

        if (this.programs[program])
        {
            let command =  compilerCommand + ' -p ' + program + ' ' + this.programs[program] + ' ' + Utils.sanitizePath(path.join(this.outputFolder, "output_" + program + ".hex"));
            Logs.log(0, "Compiler command : " + command);

            this.runCompiler(command);
        }
    }

    compileProgramsToHex(compilerCommand) {

        this.programs.forEach(program => {
            if (program)
            {
                let command =  compilerCommand + ' -p ' + this.programs.indexOf(program) + ' ' + program + ' ' + Utils.sanitizePath(path.join(this.outputFolder, "output_" + this.programs.indexOf(program) + ".hex"));
                Logs.log(0, "Compiler command : " + command);

                this.runCompiler(command);
            }
        });
    }*/
}

module.exports = Project;