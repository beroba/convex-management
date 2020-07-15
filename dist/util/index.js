"use strict";
exports.__esModule = true;
exports.IsChannel = void 0;
exports.IsChannel = function (array, channel) {
    return array.some(function (c) { return c === channel.name; });
};
