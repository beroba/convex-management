"use strict";
exports.__esModule = true;
exports.PiecesEach = exports.IsChannel = void 0;
exports.IsChannel = function (array, channel) {
    return array.some(function (c) { return c === channel.name; });
};
exports.PiecesEach = function (array, n) {
    var l = Array(Math.ceil(array.length / n));
    return Array.from(l, function (_, i) { return i; }).map(function (_, i) { return array.slice(i * n, (i + 1) * n); });
};
