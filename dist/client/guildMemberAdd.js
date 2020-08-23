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
exports.GuildMemberAdd = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../util"));
exports.GuildMemberAdd = function (member) {
    var _a, _b;
    if (member.guild.id !== throw_env_1["default"]('CLAN_SERVER_ID'))
        return;
    var channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CHAT);
    channel.send("<@!" + ((_a = member.user) === null || _a === void 0 ? void 0 : _a.id) + "> \u307E\u305A\u306F <#" + const_settings_1["default"].CHANNEL_ID.CHANNEL_POLICY + "> \u3092\u78BA\u8A8D\u3057\u306A\u3055\u3044\uFF01\n" +
        ("\u3061\u3083\u3093\u3068 <#" + const_settings_1["default"].CHANNEL_ID.INTRODUCTION + "> \u3082\u66F8\u304F\u3053\u3068\u306D"));
    console.log("I\u2019m " + ((_b = member.user) === null || _b === void 0 ? void 0 : _b.username) + ", a new member.");
};
