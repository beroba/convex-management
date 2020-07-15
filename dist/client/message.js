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
exports.Message = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../util"));
var command_1 = require("./command");
exports.Message = function (msg) {
    var _a;
    if (((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id) !== throw_env_1["default"]('CLAN_SERVER_ID'))
        return;
    if (msg.content.charAt(0) === '/')
        return command_1.Command(msg);
    var comment;
    comment = SendYabaiImage(msg);
    if (comment)
        return console.log(comment);
};
var SendYabaiImage = function (msg) {
    if (!util.IsChannel('SEND_IMAGE_CHANNEL', msg.channel))
        return;
    var match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/);
    if (!match)
        return;
    msg.channel.send('', { files: [const_settings_1["default"].URL.YABAIWAYO] });
    return 'Send Yabai Image';
};
