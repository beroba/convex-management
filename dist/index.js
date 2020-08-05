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
var Discord = __importStar(require("discord.js"));
var throw_env_1 = __importDefault(require("throw-env"));
var ready_1 = require("./client/ready");
var guildMemberAdd_1 = require("./client/guildMemberAdd");
var guildMemberUpdate_1 = require("./client/guildMemberUpdate");
var message_1 = require("./client/message");
var cron_1 = require("./util/cron");
var client = new Discord.Client();
client.on('ready', function () { return ready_1.Ready(client); });
client.on('guildMemberAdd', function (member) { return guildMemberAdd_1.GuildMemberAdd(client, member); });
client.on('guildMemberUpdate', function (_, member) { return guildMemberUpdate_1.GuildMemberUpdate(member); });
client.on('message', function (msg) { return message_1.Message(msg); });
cron_1.SetRemainConvex(client);
client.login(throw_env_1["default"]('CAL_TOKEN'));
