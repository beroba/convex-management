"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Message = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
exports.Message = function (msg) {
    var _a, _b;
    if (((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.id) !== throw_env_1["default"]('CLAN_SERVER_ID'))
        return;
    console.log((_b = msg.guild.roles.cache.get('719906267824521267')) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return m.user; }));
    var comment;
    comment = SendYabaiImage(msg);
    if (comment)
        return console.log(comment);
};
var SendYabaiImage = function (msg) {
    var channel = msg.channel;
    if (!const_settings_1["default"].SEND_IMAGE_CHANNEL.some(function (c) { return c === (channel === null || channel === void 0 ? void 0 : channel.name); }))
        return;
    var match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/);
    if (!match)
        return;
    msg.channel.send('', { files: [const_settings_1["default"].URL.YABAIWAYO] });
    return 'Send Yabai Image';
};
