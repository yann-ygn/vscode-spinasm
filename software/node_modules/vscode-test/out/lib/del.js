"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rmdir = void 0;
var rimraf = require("rimraf");
function rmdir(dir) {
    return new Promise(function (c, e) {
        rimraf(dir, function (err) {
            if (err) {
                return e(err);
            }
            c();
        });
    });
}
exports.rmdir = rmdir;
