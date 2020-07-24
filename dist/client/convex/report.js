"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Report = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
exports.Report = function (msg) {
    var _a;
    if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
        return;
    if (msg.channel.id !== const_settings_1["default"].CONVEX_CHANNEL.REPORT_ID)
        return;
    switch (true) {
        case /1|2|3/.test(msg.content.charAt(0)):
            msg.react(const_settings_1["default"].EMOJI_ID.KAKUNIN);
            break;
        default:
            msg.reply('形式が違うわ、やりなおし！');
    }
};
