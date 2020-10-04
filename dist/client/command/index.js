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
exports.__esModule = true;
exports.Command = void 0;
var util = __importStar(require("../../util"));
var management_1 = require("./management");
var clanbattle_1 = require("./clanbattle");
exports.Command = function (msg) {
    var _a;
    if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
        return;
    var content = util.Format(msg.content);
    var comment;
    comment = clanbattle_1.ClanBattle(content, msg);
    if (comment)
        return console.log(comment);
    comment = management_1.Management(content, msg);
    if (comment)
        return console.log(comment);
};
