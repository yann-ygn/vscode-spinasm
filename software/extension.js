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

// unitialized object
let config = undefined;
let prog = undefined;

if (! project.emptyProject()) {
	// Config object
	config = new Config(project.iniFilePath);

	// Programmer object
	prog = new Programmer(config.readSerialPort(), config.readBaudRate());
}

function activate(context) {
	context.subscriptions.push(

		vscode.commands.registerCommand('spinasm.createproject', function () {

			try {
				Logs.log(0, "Creating project structure in folder : " + project.rootFolder);
				project.createProjectStructure();
				config = new Config(project.iniFilePath);
				prog = new Programmer(config.readSerialPort(), config.readBaudRate());
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

		vscode.commands.registerCommand('spinasm.compilecurrentprogram', function () {

			try {
				config.readConfigFile();
				project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

				let currentProgram = project.programs.indexOf(vscode.window.activeTextEditor.document.uri.fsPath.toString()); // Get the program # of the current opened document

				project.compileProgramToHex(currentProgram);
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
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram0', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[0]);

				prog.uploadProgram(0, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram1', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[1]);

				prog.uploadProgram(1, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram2', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[2]);

				Logs.log(0, programData.address);

				prog.uploadProgram(2, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram3', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[3]);

				prog.uploadProgram(3, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram4', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[4]);

				prog.uploadProgram(4, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram5', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[5]);

				prog.uploadProgram(5, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram6', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[6]);

				prog.uploadProgram(6, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadprogram7', function () {

			try {
				config.readConfigFile();
				let programData = prog.readIntelHexData(project.outputs[7]);

				prog.uploadProgram(7, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.uploadcurrentprogram', function () {

			try {
				config.readConfigFile();

				let currentProgram = project.programs.indexOf(vscode.window.activeTextEditor.document.uri.fsPath.toString()); // Get the program # of the current opened document
				
				let programData = prog.readIntelHexData(project.outputs[currentProgram]);

				prog.uploadProgram(currentProgram, programData.address, programData.data);
			}
			catch (error) {
				Logs.log(1, error.message);
			}
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram0', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(0);

			let programData = prog.readIntelHexData(project.outputs[0]);

			prog.uploadProgram(0, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram1', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(1);

			let programData = prog.readIntelHexData(project.outputs[1]);

			prog.uploadProgram(1, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram2', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(2);

			let programData = prog.readIntelHexData(project.outputs[2]);

			prog.uploadProgram(2, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram3', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(3);

			let programData = prog.readIntelHexData(project.outputs[3]);

			prog.uploadProgram(3, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram4', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(1);

			let programData = prog.readIntelHexData(project.outputs[4]);

			prog.uploadProgram(4, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram5', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(5);

			let programData = prog.readIntelHexData(project.outputs[5]);

			prog.uploadProgram(5, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram6', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(6);

			let programData = prog.readIntelHexData(project.outputs[6]);

			prog.uploadProgram(6, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadprogram7', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			project.compileProgramToHex(7);

			let programData = prog.readIntelHexData(project.outputs[7]);

			prog.uploadProgram(7, programData.address, programData.data);
		}),

		vscode.commands.registerCommand('spinasm.compileanduploadcurrentprogram', function () {

			config.readConfigFile();
			project.buildSetup(config.readCompilerCommand(), config.readCompilerArgs());

			let currentProgram = project.programs.indexOf(vscode.window.activeTextEditor.document.uri.fsPath.toString()); // Get the program # of the current opened document

			project.compileProgramToHex(currentProgram);

			let programData = prog.readIntelHexData(project.outputs[currentProgram]);

			prog.uploadProgram(currentProgram, programData.address, programData.data);
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
