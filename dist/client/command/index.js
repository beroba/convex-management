"use strict";
exports.__esModule = true;
exports.Command = void 0;
var management_1 = require("./management");
var clanbattle_1 = require("./clanbattle");
var moji = require('moji');
exports.Command = function (msg) {
    var _a;
    if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
        return;
    var content = moji(msg.content).convert('ZE', 'HE').convert('ZS', 'HS').toString();
    var comment;
    comment = clanbattle_1.ClanBattle(content, msg);
    if (comment)
        return console.log(comment);
    comment = management_1.Management(content, msg);
    if (comment)
        return console.log(comment);
};
