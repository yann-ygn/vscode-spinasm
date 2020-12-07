"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildNativeModules = exports.rebuild = exports.preGypFixRun = exports.shouldRebuildNativeModules = exports.installNodeHeaders = void 0;
const rebuild_1 = require("./rebuild");
Object.defineProperty(exports, "rebuild", { enumerable: true, get: function () { return rebuild_1.rebuild; } });
Object.defineProperty(exports, "rebuildNativeModules", { enumerable: true, get: function () { return rebuild_1.rebuildNativeModules; } });
const installNodeHeaders = () => Promise.resolve();
exports.installNodeHeaders = installNodeHeaders;
const shouldRebuildNativeModules = () => Promise.resolve(true);
exports.shouldRebuildNativeModules = shouldRebuildNativeModules;
const preGypFixRun = () => Promise.resolve();
exports.preGypFixRun = preGypFixRun;
exports.default = rebuild_1.rebuild;
Object.defineProperty(exports, '__esModule', {
    value: true
});
//# sourceMappingURL=main.js.map