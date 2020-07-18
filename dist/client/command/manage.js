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
exports.Manage = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
exports.Manage = function (command, msg) {
    if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.MANAGEMENT, msg.channel))
        return;
    switch (command.split(' ')[0]) {
        case '/manage.resetmember':
            resetMember(msg);
            return 'Reset convex management members';
    }
};
var resetMember = function (msg) {
    var _a, _b;
    msg.reply((_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get('719906267824521267')) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return m.user.username; }));
};
