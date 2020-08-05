"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.GuildMemberUpdate = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
exports.GuildMemberUpdate = function (member) {
    var _a;
    var bool = (_a = member.guild.roles.cache.get(const_settings_1["default"].ROLE_ID.YABAIWAYO)) === null || _a === void 0 ? void 0 : _a.members.some(function (m) { return m.user === member.user; });
    if (!bool)
        return;
    if (member.user.id === const_settings_1["default"].ADMIN_ID)
        return;
    member.roles.remove(const_settings_1["default"].ROLE_ID.YABAIWAYO);
    console.log('Delete yabaiwayo Role');
};
