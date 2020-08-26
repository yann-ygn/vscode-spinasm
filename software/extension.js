const vscode = require('vscode');
const path = require("path");
const SerialPort = require('serialport');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Utils = require('./utils.js');
const Project = require('./project.js');
const Config = require('./config.js');
const Programmer = require('./programmer.js');
			
// Current folder path
const rootFolderPath = vscode.workspace.rootPath.toString();

// Project object
const project = new Project(rootFolderPath);

// Config object
const config = new Config(project.iniFilePath);

// Programmer object
const prog = new Programmer(config.readSerialPort(), project.outputFolder);

// Output log
const outputConsole = vscode.window.createOutputChannel("SPIN");

// Helper functions

function buildSetup() {
	outputConsole.appendLine("Reading config file : " + project.iniFilePath);
	config.readConfigFile();
	let compiler = config.readCompilerCommand()
	outputConsole.appendLine("Compiler : " + compiler);

	outputConsole.appendLine("Getting available programs");
	project.getAvailablePrograms();

	outputConsole.appendLine("Available programs :");
	project.programs.forEach(program => {
		outputConsole.appendLine("Program " + project.programs.indexOf(program) + " : " + program);
	});

	return compiler;
}

async function runCompiler(command) {

	try {
		const { stdout, stderr } = await exec(command);

		if (stderr) {
			outputConsole.appendLine("asfv1 stderr : " + stderr);
		}
		if (stdout) {
			outputConsole.appendLine("asfv1 stdout : " + stdout);
		}
	} 
	catch (err) {
		outputConsole.appendLine("asfv1 returned an error : " + err.code + err.message);
	}
}

function compileProgramsToBin(compilerCommand) {

	project.programs.forEach(program => {
		if (program)
		{
			let command =  compilerCommand + ' -p ' + project.programs.indexOf(program) + ' ' + program + ' ' + Utils.sanitizePath(path.join(project.outputFolder, "output.bin"));
			outputConsole.appendLine("Compiler command : " + command);
			
			runCompiler(command);
		}
	});
}

function compileProgramToHex(compilerCommand, program) {

	if (project.programs[program])
	{
		let command =  compilerCommand + ' -p ' + program + ' ' + project.programs[program] + ' ' + Utils.sanitizePath(path.join(project.outputFolder, "output_" + program + ".hex"));
		outputConsole.appendLine("Compiler command : " + command);

		runCompiler(command);
	}
}

function compileProgramsToHex(compilerCommand) {

	project.programs.forEach(program => {
		if (program)
		{
			let command =  compilerCommand + ' -p ' + project.programs.indexOf(program) + ' ' + program + ' ' + Utils.sanitizePath(path.join(project.outputFolder, "output_" + project.programs.indexOf(program) + ".hex"));
			outputConsole.appendLine("Compiler command : " + command);
			
			runCompiler(command);
		}
	});
}

///////

function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('spinasm.createproject', function () {

			try {
				outputConsole.appendLine("Creating project structure in folder : " + project.rootFolder);
				project.createProjectStructure();
				outputConsole.appendLine("Project structure created");
			} 
			catch (error) {
				outputConsole.appendLine(error.message);
			}
		}),
	
		vscode.commands.registerCommand('spinasm.compileprogram0', function () {

			try {
				let compiler = buildSetup();
				outputConsole.appendLine("Removing existing program 0 output file");
				project.removeHexProgram(0);

				outputConsole.appendLine("Compiling program 0");
				compileProgramToHex(compiler, 0);
			} 
			catch (error) {
				outputConsole.appendLine(error.message);
			}

		}),

		vscode.commands.registerCommand('spinasm.compileprogram1', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileprogram2', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileprogram3', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileprogram4', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileprogram5', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileprogram6', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileprogram7', function () {

		}),

		vscode.commands.registerCommand('spinasm.compileallprograms', function () {

			try {
				let compiler = buildSetup();
				outputConsole.appendLine("Removing hex programs output file");
				project.removeHexPrograms();

				outputConsole.appendLine("Compiling all programs");
				compileProgramsToHex(compiler);
			} 
			catch (error) {
				outputConsole.appendLine(error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileallprogramstobin', function () {

		}),
		
		vscode.commands.registerCommand('spinasm.test', function () {
			let test = prog.readIntelHexData(path.join(project.outputFolder, "output_0.hex"));
			outputConsole.appendLine(test.toString());
			outputConsole.appendLine(test.length.toString());
		}),
		
		vscode.commands.registerCommand('spinasm.testserial', function () {
			
			// Get the serial port to use from the config
			const port = "COM6";
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
			 * 
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
