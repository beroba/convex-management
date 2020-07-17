"use strict";
exports.__esModule = true;
exports.Command = void 0;
var management_1 = require("./management");
exports.Command = function (msg) {
    var _a;
    if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
        return;
    var command = msg.content.replace(/ |\.|,|:|=/, '.');
    var comment;
    comment = management_1.Management(command, msg);
    if (comment)
        return console.log(comment);
};
