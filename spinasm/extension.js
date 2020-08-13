// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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

		const folderPath = vscode.workspace.rootPath.toString();

		// Folder structure -> Slot 0
		fs.mkdir(path.join(folderPath, 'slot_0'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 1
		fs.mkdir(path.join(folderPath, 'slot_1'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 2
		fs.mkdir(path.join(folderPath, 'slot_2'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 3
		fs.mkdir(path.join(folderPath, 'slot_3'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 4
		fs.mkdir(path.join(folderPath, 'slot_4'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 5
		fs.mkdir(path.join(folderPath, 'slot_5'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 6
		fs.mkdir(path.join(folderPath, 'slot_6'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		// Folder structure -> Slot 7
		fs.mkdir(path.join(folderPath, 'slot_7'), (err) => {
			if (err) {
				return vscode.window.showErrorMessage(err.message);
			}
		})

		

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
