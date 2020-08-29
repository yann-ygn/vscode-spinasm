const vscode = require('vscode');
const path = require("path");
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
const prog = new Programmer(config.readSerialPort());

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

async function test(data, address) {
	// Get the serial port to use from the config
	/*const port = config.readSerialPort();
	outputConsole.appendLine('Serial port : ' + port);

	outputConsole.appendLine("Connecting to programmer on port : " + port);	
	if (await prog.connectProgrammer()) {
		outputConsole.appendLine("Programmer connected");

		outputConsole.appendLine("Sending write order");

		if (await prog.sendWriteOrder()) {
			outputConsole.appendLine("Write order successfull");

			outputConsole.appendLine("Sending write address");
			if (await prog.sendAddress(address)) {
				outputConsole.appendLine("Write address successfull");
			}
		}
	}
	else {
		outputConsole.appendLine("Programmer not connected");
	}*/

	await prog.writeProgram(0, data);
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
			let data = prog.readIntelHexData(path.join(project.outputFolder, "output_0.hex"));
			
			test(data.data, data.address);
		}),
		
		vscode.commands.registerCommand('spinasm.testserial', function () {
			
			try {
				test();
			}
			catch (error) {
				outputConsole.appendLine("Error : " + error);
			}
		})
	);
}
exports.activate = activate;

// prog method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
