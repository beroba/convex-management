"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.IsChannel = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
exports.IsChannel = function (key, channel) {
    return const_settings_1["default"][key].some(function (c) { return c === channel.name; });
};
