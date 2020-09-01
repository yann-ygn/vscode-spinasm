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

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(3);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileprogram4', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(4);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileprogram5', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(5);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}

		}),

		vscode.commands.registerCommand('spinasm.compileprogram6', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(6);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileprogram7', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				
				project.compileProgramToHex(7);				
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileallprograms', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

				project.programs.forEach(program => {
					project.compileProgramToHex(project.programs.indexOf[program]);
				});
			} 
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileallprogramstobin', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());
				project.removeBinPrograms();

				project.programs.forEach(program => {
					project.compileProgramtoBin(project.programs.indexOf[program]);
				});
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram0', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_0.hex"));

				prog.uploadProgram(0, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram1', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_1.hex"));

				prog.uploadProgram(1, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram2', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_2.hex"));

				Logs.log(0, programData.address);

				prog.uploadProgram(2, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram3', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_3.hex"));

				prog.uploadProgram(3, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram4', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_4.hex"));

				prog.uploadProgram(4, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram5', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_5.hex"));

				prog.uploadProgram(5, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram6', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_6.hex"));

				prog.uploadProgram(6, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram7', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_7.hex"));

				prog.uploadProgram(7, programData.address, programData.data);
			} 
			catch (error) {
				
			}
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram0', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

				project.compileProgramToHex(0);

				let programData = prog.readIntelHexData(path.join(project.outputFolder, "output_0.hex"));

				prog.uploadProgram(0, programData.address, programData.data);
			} 
			catch (error) {
				
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
