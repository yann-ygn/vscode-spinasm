const vscode = require('vscode');
const path = require("path");

const Project = require('./project.js');
const Config = require('./config.js');
const Programmer = require('./programmer.js');
const Logs = require('./logs.js');

// Logs
Logs.createChannel();

// Current folder path
const rootFolderPath = vscode.workspace.rootPath.toString();

// Project object
const project = new Project(rootFolderPath);

// Config object
const config = new Config(project.iniFilePath);

// Programmer object
const prog = new Programmer(config.readSerialPort());

// Helper functions

function buildSetup() {
	try {
		Logs.log(0, "Reading config file : " + project.iniFilePath);
		config.readConfigFile();
		let compiler = config.readCompilerCommand()
		Logs.log(0, "Compiler : " + compiler);

		Logs.log(0, "Getting available programs");
		project.getAvailablePrograms();

		Logs.log(0, "Available programs :");
		project.programs.forEach(program => {
			Logs.log(0, "Program " + project.programs.indexOf(program) + " : " + program);
		});

		return compiler;
	}
	catch (error) {
		Logs.log(1, error.message);
	}
}

function buildProgram(program) {
	try {
		let compiler = buildSetup();
		Logs.log(0, "Removing existing program " + program + " output file");
		project.removeHexProgram(0);

		Logs.log(0, "Compiling program : " + program);
		project.compileProgramToHex(compiler, program);
	}
	catch (error) {
		Logs.log(1, error.message);
	}
}

function buildAllPrograms() {
	try {
		let compiler = buildSetup();
		Logs.log(0, "Removing hex programs output file");
		project.removeHexPrograms();

		Logs.log(0, "Compiling all programs");
		project.compileProgramsToHex(compiler);
	}
	catch (error) {
		Logs.log(0, error.message);
	}
}

function buildAllProgramsToBin() {
	try {
		let compiler = buildSetup();
		Logs.log(0, "Removing bin programs output file");
		project.removeBinPrograms();

		Logs.log(0, "Compiling all programs");
		project.compileProgramsToBin(compiler);
	} 
	catch (error) {
		Logs.log(0, error.message);
	}
}

async function uploadProgram(program, address, data) {
	try {
		const port = config.readSerialPort();
		Logs.log(0, 'Serial port : ' + port);

		Logs.log(0, "Connecting to programmer on port : " + port);	
		if (await prog.connectProgrammer()) {
			Logs.log(0, "Programmer connected");

			/*
			Logs.log(0, "Writing program : 0");
			if (await prog.writeProgram(0, data)) {
				Logs.log(0, "Writing successfull");
			}*/

			Logs.log(0, "Reading program : 0");
			let resultBuffer = Buffer.alloc(512);
			resultBuffer = await prog.readProgram(0);

			let result = Buffer.compare(data, resultBuffer);

			Logs.log(0, "Comparison : " + result);

			Logs.log(0, "Disconnecting programmer on port : " + port);
			if (await prog.disconnectProgrammer()) {
				Logs.log(0, "Programmer disconnected");
			}
		}
		else {
			Logs.log(1, "Programmer not connected");
		}
	}
	catch (error) {
		Logs.log(0, error.message);
	}
}

async function test(data, address) {
	try {
		// Get the serial port to use from the config
		const port = config.readSerialPort();
		Logs.log(0, 'Serial port : ' + port);

		Logs.log(0, "Connecting to programmer on port : " + port);	
		if (await prog.connectProgrammer()) {
			Logs.log(0, "Programmer connected");

			/*
			Logs.log(0, "Writing program : 0");
			if (await prog.writeProgram(0, data)) {
				Logs.log(0, "Writing successfull");
			}*/

			Logs.log(0, "Reading program : 0");
			let resultBuffer = Buffer.alloc(512);
			resultBuffer = await prog.readProgram(0);

			let result = Buffer.compare(data, resultBuffer);

			Logs.log(0, "Comparison : " + result);

			Logs.log(0, "Disconnecting programmer on port : " + port);
			if (await prog.disconnectProgrammer()) {
				Logs.log(0, "Programmer disconnected");
			}
		}
		else {
			Logs.log(1, "Programmer not connected");
		}
	} catch (error) {
		throw error.message;
	}
}

///////

function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('spinasm.createproject', function () {

			try {
				Logs.log(0, "Creating project structure in folder : " + project.rootFolder);
				project.createProjectStructure();
				Logs.log(0, "Project structure created");
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),
	
		vscode.commands.registerCommand('spinasm.compileprogram0', function () {

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
				Logs.log(0, "Error : " + error);
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
