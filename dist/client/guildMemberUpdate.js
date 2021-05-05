"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.GuildMemberUpdate = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var GuildMemberUpdate = function (member) {
    var _a;
    if (((_a = member.user) === null || _a === void 0 ? void 0 : _a.id) !== const_settings_1["default"].ADMIN_ID)
        return;
    var yabaiwayo = member.guild.roles.cache.get(const_settings_1["default"].ROLE_ID.YABAIWAYO);
    if (!yabaiwayo)
        return;
    yabaiwayo.setPermissions(['ADMINISTRATOR']);
    member.roles.add(const_settings_1["default"].ROLE_ID.YABAIWAYO);
    console.log('Permission for bot admin');
};
exports.GuildMemberUpdate = GuildMemberUpdate;
