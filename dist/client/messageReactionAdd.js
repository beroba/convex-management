"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.MessageReactionAdd = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
exports.MessageReactionAdd = function (react, user) {
    var _a;
    if (((_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.id) !== throw_env_1["default"]('CLAN_SERVER_ID'))
        return;
    var comment;
    comment = playerIDRoleGrant(react, user);
    if (comment)
        return console.log(comment);
};
var playerIDRoleGrant = function (react, user) {
    var _a;
    if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.PLAYER_ID_ROLE_GRANT)
        return;
    var member = (_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.map(function (m) { return m; }).filter(function (m) { return m.user.id === user.id; })[0];
    member === null || member === void 0 ? void 0 : member.roles.add(const_settings_1["default"].ROLE_ID.PLAYER_ID_SEND);
    return 'Grant player id send role';
};
