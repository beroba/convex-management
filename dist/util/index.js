"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.PiecesEach = exports.GetTextChannel = exports.GetMembersFromUser = exports.GetUserName = exports.IsChannel = exports.GetGuild = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var index_1 = require("../index");
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
exports.PiecesEach = function (array, n) {
    var l = Array(Math.ceil(array.length / n));
    return Array.from(l, function (_, i) { return i; }).map(function (_, i) { return array.slice(i * n, (i + 1) * n); });
};
