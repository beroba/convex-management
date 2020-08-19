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
exports.Client = void 0;
var Discord = __importStar(require("discord.js"));
var throw_env_1 = __importDefault(require("throw-env"));
var ready_1 = require("./client/ready");
var guildMemberAdd_1 = require("./client/guildMemberAdd");
var guildMemberUpdate_1 = require("./client/guildMemberUpdate");
var message_1 = require("./client/message");
var cron_1 = require("./util/cron");
exports.Client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
exports.Client.on('ready', function () { return ready_1.Ready(); });
exports.Client.on('guildMemberAdd', function (member) { return guildMemberAdd_1.GuildMemberAdd(member); });
exports.Client.on('guildMemberUpdate', function (_, member) { return guildMemberUpdate_1.GuildMemberUpdate(member); });
exports.Client.on('message', function (msg) { return message_1.Message(msg); });
cron_1.CronOperation();
exports.Client.login(throw_env_1["default"]('CAL_TOKEN'));
