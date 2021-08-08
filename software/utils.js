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
    }
}

module.exports = Utils;