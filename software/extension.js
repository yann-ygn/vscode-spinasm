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


async function uploadProgram(program, address, data) {
	try {
		const port = config.readSerialPort();
		Logs.log(0, 'Serial port : ' + port);

		Logs.log(0, "Connecting to programmer on port : " + port);	
		if (await prog.connectProgrammer()) {
			Logs.log(0, "Programmer connected");

			Logs.log(0, "Writing program : " + program);
			if (await prog.writeProgram(data, address)) {
				Logs.log(0, "Write successfull");

				Logs.log(0, "Reading program : " + program);
				let resultBuffer = Buffer.alloc(512);
				resultBuffer = await prog.readProgram(0);

				let result = Buffer.compare(data, resultBuffer);

				Logs.log(0, "Verifying...");
				if (result == 0) {
					Logs.log(0, "Verification sucess");
				}
				else {
					Logs.log(1, "Verification failed");
				}
			}
			else {
				Logs.log(1, "Write failed");
			}


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

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(0);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileprogram1', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(1);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileprogram2', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(2);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
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
