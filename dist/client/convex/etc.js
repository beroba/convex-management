"use strict";
exports.__esModule = true;
exports.SimultConvexCalc = void 0;
var SimultConvexCalc = function (HP, A, B, msg) {
    var a = overCalc(HP, A, B);
    var b = overCalc(HP, B, A);
    msg.reply("```A " + a + "s\nB " + b + "s```\u30C0\u30E1\u30FC\u30B8\u306E\u9AD8\u3044\u65B9\u3092\u5148\u306B\u901A\u3057\u305F\u65B9\u304C\u6301\u3061\u8D8A\u3057\u6642\u9593\u304C\u9577\u304F\u306A\u308B\u308F\u3088\uFF01");
};
exports.SimultConvexCalc = SimultConvexCalc;
var overCalc = function (HP, a, b) {
    return Math.ceil(90 - (((HP - a) * 90) / b - 20));
};
