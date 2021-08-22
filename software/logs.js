const vscode = require('vscode');

const utils = require('./utils.js');

class Logs {
    constructor() {

    }

    static createChannel() {
        this.logChannel = vscode.window.createOutputChannel("SpinASM");
    }

    /**
     * @brief Log a message
     * @param {Number} type 0 = INFO, 1 = ERROR
     * @param {String} message Message to log
     */
    static log(type, message) {

        switch (type) {
            case 0:
                this.logChannel.appendLine(utils.getFormattedDate() + ' | INFO  | ' + message);
                break;

            case 1:
                message = message.replaceAll('Error: ', '');
                this.logChannel.appendLine(utils.getFormattedDate() + ' | ERROR | ' + message);
                break;

            default:
                break;
        }
    }
}

module.exports = Logs;