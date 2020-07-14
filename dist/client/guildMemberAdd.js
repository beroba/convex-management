"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.GuildMemberAdd = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
exports.GuildMemberAdd = function (client, member) {
    var _a, _b;
    if (member.guild.id !== throw_env_1["default"]('CLAN_SERVER_ID'))
        return;
    var channel = client.channels.cache.get(throw_env_1["default"]('WELCOME_CHANNEL_ID'));
    channel === null || channel === void 0 ? void 0 : channel.send("<@!" + ((_a = member.user) === null || _a === void 0 ? void 0 : _a.id) + "> \u307E\u305A\u306F <#" + throw_env_1["default"]('POLICY_CHANNEL_ID') + "> \u3092\u78BA\u8A8D\u3057\u306A\u3055\u3044\uFF01");
    console.log("I\u2019m " + ((_b = member.user) === null || _b === void 0 ? void 0 : _b.username) + ", a new member.");
};
