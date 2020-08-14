// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { Console } = require('console');

// Output log
const outputConsole = vscode.window.createOutputChannel("SPIN");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "spinasm" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('spinasm.createproject', function () {
		// The code you place here will be executed every time your command is executed

		const fs = require("fs");
		const path = require("path");
		const ini = require("ini");

		// Current folder
		const folderPath = vscode.workspace.rootPath.toString();

		// Folder structure
		const folder0 = path.join(folderPath, 'slot_0');
		const folder1 = path.join(folderPath, 'slot_1');
		const folder2 = path.join(folderPath, 'slot_2');
		const folder3 = path.join(folderPath, 'slot_3');
		const folder4 = path.join(folderPath, 'slot_4');
		const folder5 = path.join(folderPath, 'slot_5');
		const folder6 = path.join(folderPath, 'slot_6');
		const folder7 = path.join(folderPath, 'slot_7');

		// Program structure
		const program0 = path.join(folder0, '0_programName.spn');
		const program1 = path.join(folder1, '1_programName.spn');
		const program2 = path.join(folder2, '2_programName.spn');
		const program3 = path.join(folder3, '3_programName.spn');
		const program4 = path.join(folder4, '4_programName.spn');
		const program5 = path.join(folder5, '5_programName.spn');
		const program6 = path.join(folder6, '6_programName.spn');
		const program7 = path.join(folder7, '7_programName.spn');

		// Program content
		const programContent = ";Blank program";

		// .init file
		const iniFile = path.join(folderPath, 'settings.ini');
		const iniFileContent = 
`; Project config file

[asfv1]
path = C:\\Users\\Yann\\.platformio\\python37\\Scripts\\asfv1.exe
options = -s
`

		// Folder structure -> Slot 0
		if (! fs.existsSync(folder0)) {
			fs.mkdir(folder0, (err) => {
				outputConsole.appendLine('Creating ' + folder0);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder0 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 1
		if (! fs.existsSync(folder1)) {
			fs.mkdir(folder1, (err) => {
				outputConsole.appendLine('Creating ' + folder1);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder1 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 2
		if (! fs.existsSync(folder2)) {
			fs.mkdir(folder2, (err) => {
				outputConsole.appendLine('Creating ' + folder2);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder2 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 3
		if (! fs.existsSync(folder3)) {
			fs.mkdir(folder3, (err) => {
				outputConsole.appendLine('Creating ' + folder3);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder3 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 4
		if (! fs.existsSync(folder4)) {
			fs.mkdir(folder4, (err) => {
				outputConsole.appendLine('Creating ' + folder4);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder4 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 5
		if (! fs.existsSync(folder5)) {
			fs.mkdir(folder5, (err) => {
				outputConsole.appendLine('Creating ' + folder5);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder5 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 6
		if (! fs.existsSync(folder6)) {
			fs.mkdir(folder6, (err) => {
				outputConsole.appendLine('Creating ' + folder6);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder6 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Slot 7
		if (! fs.existsSync(folder7)) {
			fs.mkdir(folder7, (err) => {
				outputConsole.appendLine('Creating ' + folder7);
				if (err) {
					outputConsole.appendLine('Error creating ' + folder7 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #0
		if (! fs.existsSync(program0)) {
			fs.writeFile(program0, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program0);
				if (err) {
					outputConsole.appendLine('Error creating ' + program0 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #1
		if (! fs.existsSync(program1)) {
			fs.writeFile(program1, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program1);
				if (err) {
					outputConsole.appendLine('Error creating ' + program1 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #2
		if (! fs.existsSync(program2)) {
			fs.writeFile(program2, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program2);
				if (err) {
					outputConsole.appendLine('Error creating ' + program2 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #3
		if (! fs.existsSync(program3)) {
			fs.writeFile(program3, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program3);
				if (err) {
					outputConsole.appendLine('Error creating ' + program3 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #4
		if (! fs.existsSync(program4)) {
			fs.writeFile(program4, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program4);
				if (err) {
					outputConsole.appendLine('Error creating ' + program4 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #5
		if (! fs.existsSync(program5)) {
			fs.writeFile(program5, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program5);
				if (err) {
					outputConsole.appendLine('Error creating ' + program5 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #6
		if (! fs.existsSync(program6)) {
			fs.writeFile(program6, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program6);
				if (err) {
					outputConsole.appendLine('Error creating ' + program6 + ' : ' + err.message);
				}
			});
		}

		// Folder structure -> Program #7
		if (! fs.existsSync(program7)) {
			fs.writeFile(program7, programContent, (err) => {
				outputConsole.appendLine('Creating ' + program7);
				if (err) {
					outputConsole.appendLine('Error creating ' + program7 + ' : ' + err.message);
				}
			});
		}

		// Ini file
		if (! fs.existsSync(iniFile)) {
			fs.writeFile(iniFile, iniFileContent, (err) => {
				outputConsole.appendLine('Creating ' + iniFile);
				if (err) {
					outputConsole.appendLine('Error creating ' + iniFile + ' : ' + err.message);
				}
			});
		}

		outputConsole.appendLine("Project structure created");
		vscode.window.showInformationMessage("Project structure created");
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
