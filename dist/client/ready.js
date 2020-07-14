"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Ready = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
exports.Ready = function (client) {
    var _a;
    var channel = client.channels.cache.get(throw_env_1["default"]('NOTIFY_CHANNEL_ID'));
    channel === null || channel === void 0 ? void 0 : channel.send(const_settings_1["default"].STARTUP_MESSAGE);
    console.log("Logged in as " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + "!");
};
