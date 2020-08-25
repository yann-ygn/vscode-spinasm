// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const ini = require("ini");
const exec = require('child_process');
const SerialPort = require('serialport');
const os = require('os'); 
			
// Current folder path
const folderPath = vscode.workspace.rootPath.toString();

// Ini file path
const iniFile = path.join(folderPath, 'settings.ini');

// Init object
let config;

// Folder structure
const outputFolder = path.join(folderPath, 'output');

// Program content
const programContent = ";Blank program";

// Output file path
var outputBinFile = path.join(outputFolder, 'output.bin');

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
// Config
let compilerCommand;

// Programs array
let programs = [];

// Output log
const outputConsole = vscode.window.createOutputChannel("SPIN");

/**
 * @brief Cleanup folder paths
 * 
 * @param {*} path 
 */
function sanitizePath(path) {

	let returnPath;

	if (os.type() == "Windows_NT") {
		if (path.includes(" ") && path.charAt(0) != '"' && path.charAt(path.length -1)) { // Path includes spaces and no quotes
			returnPath = '"' + path + '"'; // Add quotes		
		}
		else {
			returnPath = path;
		}
	}

	if (os.type() == "Linux" || "Darwin") {

	}
	
	return returnPath;
}

/**
 * @brief Parse the configuration and set the required variables.
 */
function parseConfig() {	

	// Read the ini file
	if (fs.existsSync(iniFile)) {
		config = ini.parse(fs.readFileSync(iniFile, 'utf-8'));
	}

	let strComp = config.asfv1.path.trim(); // Read the compiler exeutable path
	compilerCommand = sanitizePath(strComp); // Sanitize it
	outputConsole.appendLine("Compiler path : " + compilerCommand);

	let strCompOpt = config.asfv1.options.trim(); // Read the compiler options
	if (strCompOpt && strCompOpt.match("(\ ?(-q|-c|-s))*")) { // Check if it's valid and save it
		outputConsole.appendLine("Compiler options : " + strCompOpt);
		compilerCommand = compilerCommand + " " + strCompOpt;
	}

	outputConsole.appendLine("Compiler command line : " + compilerCommand);
}

/**
 * @brief Create a blank project
 */
function createProjectStructure() {

	for (let i = 0; i < 8; i++) {
		let folder = path.join(folderPath, "bank_" + i);
		let file = path.join(folder, i + "_programName.spn");

		if (! fs.existsSync(folder)) { // Folder doesn't exist
			try {
				fs.mkdirSync(folder) // Bank folder
				outputConsole.appendLine('Creating ' + folder);
			}
			catch (err) {
				outputConsole.appendLine('Error creating ' + folder + ' : ' + err.message);
			}
			
			try {
				fs.writeFileSync(file, programContent) // Blank program file
				outputConsole.appendLine('Creating ' + file);
			}
			catch (err) {
				outputConsole.appendLine('Error creating ' + file + ' : ' + err.message);
			}
		}
		else { // Folder exists
			outputConsole.appendLine('Folder ' + folder + " already exists");

			let programFile = fs.readdirSync(folder).filter(str => str.match("^[0-7].*\.spn")).toString(); // Look for existing program file

			if (programFile) { // Program file found, don't create a blank file
				outputConsole.appendLine('Program file already created in ' + folder + ' : ' + programFile);
			}

			else { // Nothig found, create a blank file
				try {
					fs.writeFileSync(file, programContent) // Blank program file
					outputConsole.appendLine('Creating ' + file);
				}
				catch (err) {
					outputConsole.appendLine('Error creating ' + file + ' : ' + err.message);
				}
			}
		}
	}

	// Folder structure -> Output
	if (! fs.existsSync(outputFolder)) {
		try {
			fs.mkdirSync(outputFolder) // Bank folder
			outputConsole.appendLine('Creating ' + outputFolder);
		}
		catch (err) {
			outputConsole.appendLine('Error creating ' + outputFolder + ' : ' + err.message);
		}
	}

	// Ini file
	if (! fs.existsSync(iniFile)) {
		try {
			fs.writeFileSync(iniFile, programContent) // Blank program file
			outputConsole.appendLine('Creating ' + iniFile);
		}
		catch (err) {
			outputConsole.appendLine('Error creating ' + iniFile + ' : ' + err.message);
		}		
	}

	outputConsole.appendLine("Project structure created");
}

/**
 * @brief Build the array from the available programs in the bank folders
 */
function getAvailablePrograms() {

	// Reset the program array
	programs = [];

	// Iterate thu the 8 programs folders to find the programs
	for (var i = 0; i < 8; i++) {
		// Get the current folder
		let currentProgramFolder = path.join(folderPath, 'bank_' + i.toString());
		outputConsole.appendLine('Lookin for a program in folder : ' + currentProgramFolder);

		// Look for a program file in the current folder
		let programFile = fs.readdirSync(currentProgramFolder).filter(str => str.match("^[0-7].*\.spn")).toString();

		// Add it to the array if it exists
		if (programFile) {					
			outputConsole.appendLine('Found program : ' + programFile);
			let strProg = path.join(currentProgramFolder, programFile).toString();

			programs[i] = sanitizePath(strProg);			
		}
		else {
			outputConsole.appendLine('No program found');
			programs[i] = null;
		}
	}

	// Programs recap information
	outputConsole.appendLine('Programs recap : ');
	programs.forEach(program => {
		outputConsole.appendLine('Program #' + programs.indexOf(program) + ' : ' + program);
	})
}

/**
 * @brief Delete the .hex programs from the fs
 */
function removeHexPrograms() {

	for (let i = 0; i < 8; i++) {
		let file = path.join(outputFolder, "output_" + i + ".hex")

		if (fs.existsSync(file)) {
			try {
				outputConsole.appendLine('Removing ' + file);
				fs.unlinkSync(file);
			}
			catch(err) {
				outputConsole.appendLine('Error removing ' + file + 'Error : ' + err.message);
			}
		}
	}
}

/**
 * @brief Remove a selected program from the fs
 * 
 * @param {*} program 
 */
function removeHexProgram(program) {
	
	let file = path.join(outputFolder, "output_" + program + ".hex")

	if (fs.existsSync(file)) {
		try {
			outputConsole.appendLine('Removing ' + file);
			fs.unlinkSync(file);
		}
		catch(err) {
			outputConsole.appendLine('Error removing ' + file + 'Error : ' + err.message);
		}
	}
}

/**
 * @brief Remove the .bin programs from the fs
 */
function removeBinPrograms() {

	if (fs.existsSync(outputBinFile)) {
		try {
			outputConsole.appendLine('Removing ' + outputBinFile);
			fs.unlinkSync(outputBinFile);
		}
		catch(err) {
			outputConsole.appendLine('Error removing ' + outputBinFile + 'Error : ' + err.message);
		}
	}
}

async function runCompiler(command) {

	const asfv1 = exec.exec(command, function (error, stdout, stderr) {
		if (error) {
			outputConsole.appendLine(error.stack);
			outputConsole.appendLine('Error code: ' + error.code);
			outputConsole.appendLine('Signal received: ' + error.signal);
		}

		if (stdout) {
			outputConsole.appendLine('asfv1 output : ' + stdout);
		}

		if (stderr) {
			outputConsole.appendLine('asfv1 output : ' + stderr);
		}
	});

	asfv1.once('exit', function (code) {
		outputConsole.appendLine('asfv1 exited with code : ' + code);
	});
}

function compileProgramsToBin() {

	programs.forEach(program => {
		if (program)
		{
			let command =  compilerCommand + ' -p ' + programs.indexOf(program) + ' ' + program + ' ' + sanitizePath(outputBinFile);
			outputConsole.appendLine('Compiler command line : ' + command);

			const asfv1 = exec.exec(command, function (error, stdout, stderr) {
				if (error) {
					outputConsole.appendLine(error.stack);
					outputConsole.appendLine('Error code: ' + error.code);
					outputConsole.appendLine('Signal received: ' + error.signal);
				}

				if (stdout) {
					outputConsole.appendLine('asfv1 output : ' + stdout);
				}

				if (stderr) {
					outputConsole.appendLine('asfv1 output : ' + stderr);
				}
			});

			asfv1.on('exit', function (code) {
				outputConsole.appendLine('asfv1 exited with code : ' + code);
			});
		}
	})
}

function compileProgramToHex(program) {

	if (programs[program])
	{
		let command =  compilerCommand + ' -p ' + program + ' ' + programs[program] + ' ' + sanitizePath(path.join(outputFolder, "output_" + program + ".hex"));
		outputConsole.appendLine('Compiler command line : ' + command);

		runCompiler(command);
	}
	else {
		outputConsole.appendLine('Canot compile, no program file available');
	}
}

function compileProgramsToHex() {

	for (let i = 0; i < 8; i++) {
		if (programs[i])
		{
			let command =  compilerCommand + ' -p ' + i + ' ' + programs[i] + ' ' + sanitizePath(path.join(outputFolder, "output_" + i + ".hex"));
			outputConsole.appendLine('Compiler command line : ' + command);

			const asfv1 = exec.exec(command, function (error, stdout, stderr) {
				if (error) {
					outputConsole.appendLine(error.stack);
					outputConsole.appendLine('Error code: ' + error.code);
					outputConsole.appendLine('Signal received: ' + error.signal);
				}

				if (stdout) {
					outputConsole.appendLine('asfv1 output : ' + stdout);
				}

				if (stderr) {
					outputConsole.appendLine('asfv1 output : ' + stderr);
				}
			});

			asfv1.on('exit', function (code) {
				outputConsole.appendLine('asfv1 exited with code : ' + code);
			});
		}
	}
}

function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('spinasm.createproject', function () {	

			createProjectStructure();
		}),
	
		vscode.commands.registerCommand('spinasm.compileprogram0', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(0);
			compileProgramToHex(0);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram1', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(1);
			compileProgramToHex(1);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram2', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(2);
			compileProgramToHex(2);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram3', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(3);
			compileProgramToHex(3);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram4', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(4);
			compileProgramToHex(4);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram5', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(5);
			compileProgramToHex(5);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram6', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(6);
			compileProgramToHex(6);
		}),

		vscode.commands.registerCommand('spinasm.compileprogram7', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexProgram(7);
			compileProgramToHex(7);
		}),

		vscode.commands.registerCommand('spinasm.compileallprograms', function () {

			parseConfig();
			getAvailablePrograms();
			removeHexPrograms();
			compileProgramsToHex();
		}),

		vscode.commands.registerCommand('spinasm.compileallprogramstobin', function () {

			parseConfig();
			getAvailablePrograms();
			removeBinPrograms();
			compileProgramsToBin();
		}),
		
		vscode.commands.registerCommand('spinasm.testserial', function () {
			
			// Get the serial port to use from the config
			const port = config.serial.port.trim();
			outputConsole.appendLine('Serial port : ' + port);

			/**
			 * @brief Create the serial port object
			 */
			var sp = new SerialPort(port, {
				baudRate: 115200
			});

			// Callbacks
			sp.on('error', (err) => {
				outputConsole.appendLine(err);
			});

			/**
			 * @brief Open the serial port
			 * @param {*} port SerialPort object
			 */
			async function openSerialPort (port) {
				let promise = new Promise((resolve, reject) => {					
					outputConsole.appendLine("Opening serial port : " + port.path);
					port.once('open', (response) => {
						resolve();
					});
			
					port.once('error', (err) => {
						reject(err);
					});
				});

				await promise;

				if (port.isOpen) {
					outputConsole.appendLine("Port opened");
					return true;
				}
				else {
					outputConsole.appendLine("Port closed");
					return false;
				}
			}

			/**
			 * @brief Close the serial port
			 * @param {*} port SerialPort object
			 */
			async function closeSerialPort(port) {
				let promise = new Promise((resolve, reject) => {					
					outputConsole.appendLine("Closing serial port : " + port.path);
					port.close();
					port.once('close', (response) => {
						resolve();
					});
			
					port.once('error', (err) => {
						reject(err);
					});
				});

				await promise;

				if (port.isOpen) {
					outputConsole.appendLine("Port opened");
					return true;
				}
				else {
					outputConsole.appendLine("Port closed");
					return false;
				}
			}

			/**
			 * @brief Poll the programmer, send 0x01 (ruthere), expect 0x63 (ok -> return true) or no response (return false)
			 * @param {*} port SerialPort object
			 */
			async function checkProgrammerPresent (port) {
				let data = [0x01]; //ruthere

				let promise = new Promise((resolve, reject) => {					
					outputConsole.appendLine("Sending ruthere order");
					port.write(data);
					port.once('data', (response) => {
						resolve(response.toString());
					});
			
					port.once('error', (err) => {
						reject(err);
					});
				});

				let returnData = await promise;
				outputConsole.appendLine('Response : ' + returnData);
				
				if (returnData == '99') {
					outputConsole.appendLine("Programmer present");
					return true;
				}
				else {
					outputConsole.appendLine("Programmer not present");
					return false;
				}
			}

			async function checkProgrammerReady (port) {
				let data = [0x02]; // ruready

				let promise = new Promise((resolve, reject) => {					
					outputConsole.appendLine("Sending rudeady order");
					port.write(data);
					port.once('data', (response) => {
						resolve(response.toString());
					});
			
					port.once('error', (err) => {
						reject(err);
					});
				});

				let returnData = await promise;
				outputConsole.appendLine('Response : ' + returnData);
				
				if (returnData == '99') {
					outputConsole.appendLine("Programmer ready");
					return true;
				}
				else {
					outputConsole.appendLine("Programmer not ready");
					return false;
				}
			}

			(async () => {
				if (await openSerialPort(sp)) { // Serial port open
					if (await checkProgrammerPresent(sp)) { // Programmer present
						if (await checkProgrammerReady(sp)) { // Programmer ready

						}
						else { // Programmer not ready

						}
					}					
					else { // Programmer not present

					}
				}
				else { // Serial port not open

				}

				await closeSerialPort(sp);
			})();
		})
	);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
