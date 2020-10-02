"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Command = void 0;
var moji_1 = __importDefault(require("moji"));
var management_1 = require("./management");
var clanbattle_1 = require("./clanbattle");
exports.Command = function (msg) {
    var _a;
    if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
        return;
    var content = moji_1["default"](msg.content).convert('ZE', 'HE').convert('ZS', 'HS').toString();
    var comment;
    comment = clanbattle_1.ClanBattle(content, msg);
    if (comment)
        return console.log(comment);
    comment = management_1.Management(content, msg);
    if (comment)
        return console.log(comment);
};
