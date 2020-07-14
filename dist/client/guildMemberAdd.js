"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.GuildMemberAdd = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
exports.GuildMemberAdd = function (client, member) {
    var _a;
    console.log(member.guild);
    return;
    if (member.guild.name !== const_settings_1["default"].WELCOME_SERVER)
        return;
    var channel = client.channels.cache.get(throw_env_1["default"]('WELCOME_CHANNEL_ID'));
    channel === null || channel === void 0 ? void 0 : channel.send("<@!" + ((_a = member.user) === null || _a === void 0 ? void 0 : _a.id) + "> \u307E\u305A\u306F <#" + throw_env_1["default"]('GUIDE_CHANNEL_ID') + "> \u3092\u78BA\u8A8D\u3057\u306A\u3055\u3044\uFF01");
};
