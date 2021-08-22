const os = require('os');

class Utils {

    /**
     * @brief Cleanup folder paths
     *
     * @param {*} path
     */
    static sanitizePath (path) {
        let returnPath;

        if (os.type() == "Windows_NT") {

            if (path.includes(" ") && path.charAt(0) != '"' && path.charAt(path.length -1) != '"') { // Path includes spaces and no quotes at the start and the end of the string
                returnPath = '"' + path + '"'; // Add quotes
            }
            else {
                returnPath = path;
            }
        }

        if (os.type() == "Linux" || "Darwin") { // Do nothing
            returnPath = path;
        }

        return returnPath;
    };

    static getFormattedDate(){
        let d = new Date();

        let date = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

        return date;
    }
}

module.exports = Utils;