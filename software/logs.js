const vscode = require('vscode');

class Logs {
    constructor() {

    }

    static createChannel() {
        this.logChannel = vscode.window.createOutputChannel("SPIN");
    }

    /**
     * @brief Log a message
     * @param {Number} type 0 = INFO, 1 = ERROR
     * @param {String} message Message to log
     */
    static log(type, message) {

        switch (type) {
            case 0:
                this.logChannel.appendLine(new Date().toISOString() + ' INFO : ' + message);
                break;

            case 1:
                message = message.replaceAll('Error: ', '');
                this.logChannel.appendLine(new Date().toISOString() + ' ERROR : ' + message);
                break;

            default:
                break;
        }
    }
}

module.exports = Logs;