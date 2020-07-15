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
exports.Command = function (msg) {
    var _a, _b, _c;
    if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
        return;
    if (!util.IsChannel('COMMAND_CHANNEL', msg.channel))
        return;
    console.log((_c = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.get('719906267824521267')) === null || _c === void 0 ? void 0 : _c.members.map(function (m) { return m.user.username; }));
};
