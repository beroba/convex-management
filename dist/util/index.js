"use strict";
exports.__esModule = true;
exports.PiecesEach = exports.GetTextChannel = exports.GetUserName = exports.IsChannel = void 0;
var index_1 = require("../index");
exports.IsChannel = function (array, channel) {
    return array.some(function (c) { return c === channel.name; });
};
exports.GetUserName = function (m) {
    return (m === null || m === void 0 ? void 0 : m.nickname) ? m === null || m === void 0 ? void 0 : m.nickname : (m === null || m === void 0 ? void 0 : m.user.username) || '';
};
exports.GetTextChannel = function (id) { return index_1.Client.channels.cache.get(id); };
exports.PiecesEach = function (array, n) {
    var l = Array(Math.ceil(array.length / n));
    return Array.from(l, function (_, i) { return i; }).map(function (_, i) { return array.slice(i * n, (i + 1) * n); });
};
