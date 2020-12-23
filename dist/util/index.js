"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.GetTextChannel = exports.GetMembersFromUser = exports.GetUserName = exports.IsChannel = exports.GetGuild = exports.Format = void 0;
var moji_1 = __importDefault(require("moji"));
var throw_env_1 = __importDefault(require("throw-env"));
var index_1 = require("../index");
exports.Format = function (str) {
    return moji_1["default"](str)
        .convert('ZE', 'HE')
        .convert('ZS', 'HS')
        .toString()
        .replace(/[^\S\n\r]+/g, ' ');
};
exports.GetGuild = function () { return index_1.Client.guilds.cache.get(throw_env_1["default"]('CLAN_SERVER_ID')); };
exports.IsChannel = function (array, channel) {
    return array.some(function (c) { return c === channel.name; });
};
exports.GetUserName = function (m) {
    return (m === null || m === void 0 ? void 0 : m.nickname) ? m === null || m === void 0 ? void 0 : m.nickname : (m === null || m === void 0 ? void 0 : m.user.username) || '';
};
exports.GetMembersFromUser = function (member, user) {
    return member === null || member === void 0 ? void 0 : member.cache.map(function (m) { return m; }).filter(function (m) { return m.user.id === user.id; })[0];
};
exports.GetTextChannel = function (id) { return index_1.Client.channels.cache.get(id); };
