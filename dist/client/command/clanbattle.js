"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ClanBattle = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var BOSSAndLaps = __importStar(require("../convex/BOSSAndLaps"));
exports.ClanBattle = function (command, msg) {
    if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.PROGRESS, msg.channel))
        return;
    switch (true) {
        case /cb over/.test(command): {
            var arg = command.replace('/cb over ', '');
            simultConvexCalc(arg, msg);
            return 'Simultaneous convex carryover calculation';
        }
        case /cb boss/.test(command): {
            var arg = command.replace('/cb boss ', '');
            BOSSAndLaps.Update(arg, msg);
            return 'Simultaneous convex carryover calculation';
        }
    }
};
var simultConvexCalc = function (arg, msg) {
    var overCalc = function (a, b) { return Math.ceil(90 - (((HP - a) * 90) / b - 20)); };
    var _a = __read(arg.replace('　', ' ').split(' ').map(Number), 3), HP = _a[0], A = _a[1], B = _a[2];
    msg.reply("```A " + overCalc(A, B) + "s\nB " + overCalc(B, A) + "s```\u30C0\u30E1\u30FC\u30B8\u306E\u9AD8\u3044\u65B9\u3092\u5148\u306B\u901A\u3059\u3053\u3068\u306D");
};
