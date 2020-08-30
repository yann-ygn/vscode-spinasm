const vscode = require('vscode');

class Logs {
    constructor() {

    }

    static createChannel() {
        this.logChannel = vscode.window.createOutputChannel("SPIN");
    }

    static log(type, message) {
        if (type == 0) {
            this.logChannel.appendLine(new Date().toISOString() + ' INFO : ' + message);
        }

        if (type == 1) {
            this.logChannel.appendLine(new Date().toISOString() + ' ERROR : ' + message);
        }
    }
}

module.exports = Logs;