"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.GetTextChannel = exports.GetMembersFromUser = exports.GetUserName = exports.IsRole = exports.IsChannel = exports.GetCalInfo = exports.GetGuild = exports.Omit = exports.Sleep = exports.Format = void 0;
var moji_1 = __importDefault(require("moji"));
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
var index_1 = require("../index");
exports.Format = function (str) {
    return moji_1["default"](str)
        .convert('ZE', 'HE')
        .convert('ZS', 'HS')
        .toString()
        .replace(/[^\S\n\r]+/g, ' ');
};
exports.Sleep = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
exports.Omit = function (v) { return !/^,+$/.test(v.toString()); };
exports.GetGuild = function () { return index_1.Client.guilds.cache.get(throw_env_1["default"]('CLAN_SERVER_ID')); };
exports.GetCalInfo = function () { var _a; return (_a = exports.GetGuild()) === null || _a === void 0 ? void 0 : _a.members.cache.get(const_settings_1["default"].CAL_ID); };
exports.IsChannel = function (array, channel) {
    return array.some(function (c) { return c === channel.name; });
};
exports.IsRole = function (member, role) { return member === null || member === void 0 ? void 0 : member.roles.cache.some(function (r) { return r.id === role; }); };
exports.GetUserName = function (m) {
    return (m === null || m === void 0 ? void 0 : m.nickname) ? m === null || m === void 0 ? void 0 : m.nickname : (m === null || m === void 0 ? void 0 : m.user.username) || '';
};
exports.GetMembersFromUser = function (member, user) {
    return member === null || member === void 0 ? void 0 : member.cache.map(function (m) { return m; }).filter(function (m) { return m.user.id === user.id; })[0];
};
exports.GetTextChannel = function (id) { return index_1.Client.channels.cache.get(id); };
