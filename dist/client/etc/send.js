"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.YuiKusano = exports.YabaiImage = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
exports.YabaiImage = function (msg) {
    if (!util.IsChannel(const_settings_1["default"].SEND_IMAGE_CHANNEL, msg.channel))
        return;
    var match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/);
    if (!match)
        return;
    msg.channel.send('', { files: [const_settings_1["default"].URL.YABAIWAYO] });
    return 'Send Yabai Image';
};
exports.YuiKusano = function (msg) {
    var match = msg.content.replace(/草|優衣/g, 'ユイ').match(/ユイ/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.YUI_KUSANO);
    return 'React Yui Kusano';
};
