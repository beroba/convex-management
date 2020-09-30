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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var lapAndBoss = __importStar(require("../convex/lapAndBoss"));
var situation = __importStar(require("../convex/situation"));
var date = __importStar(require("../convex/date"));
var list = __importStar(require("../reservate/list"));
exports.ClanBattle = function (command, msg) {
    if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.CLAN_BATTLE, msg.channel))
        return;
    switch (true) {
        case /cb boss now/.test(command): {
            currentBossNow(msg);
            return 'Show ckurrent boss';
        }
        case /cb boss next/.test(command): {
            moveForward(msg);
            return 'Advance to next lap and boss';
        }
        case /cb boss previous/.test(command): {
            moveReturn(msg);
            return 'Advance to previous lap and boss';
        }
        case /cb boss/.test(command): {
            var arg = command.replace('/cb boss ', '');
            changeBoss(arg, msg);
            return 'Change laps and boss';
        }
        case /cb rev/.test(command): {
            var arg = command.replace('/cb rev ', '');
            reservateList(arg, msg);
            return 'Display convex reservation list';
        }
        case /cb over/.test(command): {
            var arg = command.replace('/cb over ', '');
            simultConvexCalc(arg, msg);
            return 'Simultaneous convex carryover calculation';
        }
    }
};
var currentBossNow = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _a.sent();
                if (!day)
                    return [2, msg.reply('今日はクラバトの日じゃないわ')];
                lapAndBoss.ProgressReport();
                return [2];
        }
    });
}); };
var simultConvexCalc = function (arg, msg) {
    var overCalc = function (a, b) { return Math.ceil(90 - (((HP - a) * 90) / b - 20)); };
    var _a = __read(arg.replace(/　/g, ' ').split(' ').map(Number), 3), HP = _a[0], A = _a[1], B = _a[2];
    msg.reply("```A " + overCalc(A, B) + "s\nB " + overCalc(B, A) + "s```\u30C0\u30E1\u30FC\u30B8\u306E\u9AD8\u3044\u65B9\u3092\u5148\u306B\u901A\u3059\u3053\u3068\u306D");
};
var moveForward = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _a.sent();
                if (!day)
                    return [2, msg.reply('今日はクラバトの日じゃないわ')];
                return [4, lapAndBoss.Next()];
            case 2:
                _a.sent();
                situation.Report();
                return [2];
        }
    });
}); };
var moveReturn = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _a.sent();
                if (!day)
                    return [2, msg.reply('今日はクラバトの日じゃないわ')];
                return [4, lapAndBoss.Previous()];
            case 2:
                _a.sent();
                situation.Report();
                return [2];
        }
    });
}); };
var changeBoss = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var day, bool;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _a.sent();
                if (!day)
                    return [2, msg.reply('今日はクラバトの日じゃないわ')];
                return [4, lapAndBoss.Update(arg)];
            case 2:
                bool = _a.sent();
                if (!bool)
                    return [2, msg.reply('形式が違うわ、やりなおし！')];
                situation.Report();
                return [2];
        }
    });
}); };
var reservateList = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _a.sent();
                if (!day)
                    return [2, msg.reply('今日はクラバトの日じゃないわ')];
                if (/^(a|b|c|d|e)$/i.test(arg)) {
                    list.Output(arg);
                }
                else {
                    list.AllOutput();
                }
                return [2];
        }
    });
}); };
