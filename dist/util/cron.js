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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.CronOperation = void 0;
var cron = __importStar(require("node-cron"));
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
var index_1 = require("../index");
var util = __importStar(require("../util"));
var spreadsheet = __importStar(require("../util/spreadsheet"));
var date = __importStar(require("../client/convex/date"));
var lapAndBoss = __importStar(require("../client/convex/lapAndBoss"));
exports.CronOperation = function () {
    setRemainConvex();
    fullConvexReport();
};
var setRemainConvex = function () {
    cron.schedule('0 0 5 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
        var day, guild, clanMembers, channel;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, date.GetDay()];
                case 1:
                    day = _b.sent();
                    if (!day)
                        return [2];
                    guild = index_1.Client.guilds.cache.get(throw_env_1["default"]('CLAN_SERVER_ID'));
                    clanMembers = (_a = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS)) === null || _a === void 0 ? void 0 : _a.members.map(function (m) { return m; });
                    clanMembers === null || clanMembers === void 0 ? void 0 : clanMembers.forEach(function (m) { return m === null || m === void 0 ? void 0 : m.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX); });
                    channel = util.GetTextChannel(const_settings_1["default"].STARTUP.CHANNEL_ID);
                    channel.send('クランメンバーに凸残ロールを付与したわ');
                    console.log('Add convex roll');
                    return [2];
            }
        });
    }); });
};
var fullConvexReport = function () {
    cron.schedule('0 10 5 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
        var day;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, date.GetDay()];
                case 1:
                    day = _a.sent();
                    if (!day || day === '5')
                        return [2];
                    return [4, convexConfirm()];
                case 2:
                    if (_a.sent())
                        return [2];
                    return [4, convexSituationReport()];
                case 3:
                    _a.sent();
                    console.log('Convex situation report');
                    return [2];
            }
        });
    }); });
    cron.schedule('0 10 0 * * *', function () { return __awaiter(void 0, void 0, void 0, function () {
        var day;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, date.GetDay()];
                case 1:
                    day = _a.sent();
                    if (!day || day !== '5')
                        return [2];
                    return [4, convexConfirm()];
                case 2:
                    if (_a.sent())
                        return [2];
                    return [4, convexSituationReport()];
                case 3:
                    _a.sent();
                    console.log('Convex situation report');
                    return [2];
            }
        });
    }); });
};
var convexConfirm = function () { return __awaiter(void 0, void 0, void 0, function () {
    var manageSheet, cells, col, n;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                manageSheet = _a.sent();
                return [4, spreadsheet.GetCells(manageSheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                cells = _a.sent();
                return [4, date.GetColumn(2)];
            case 3:
                col = _a.sent();
                return [4, manageSheet.getCell(col + "1")];
            case 4:
                n = (_a.sent()).getValue();
                return [2, Number(n) === cells.filter(function (v) { return v; }).length];
        }
    });
}); };
var convexSituationReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var day, state, guild, 凸残, channel;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _b.sent();
                return [4, lapAndBoss.GetCurrent()];
            case 2:
                state = _b.sent();
                guild = index_1.Client.guilds.cache.get(throw_env_1["default"]('CLAN_SERVER_ID'));
                凸残 = (_a = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX)) === null || _a === void 0 ? void 0 : _a.members.map(function (m) { return "<@!" + m.user.id + ">"; });
                channel = util.GetTextChannel(const_settings_1["default"].CONVEX_CHANNEL.PROGRESS_ID);
                channel.send(day + "\u65E5\u76EE\u306E\u51F8\u72B6\u6CC1\u5831\u544A\u3088\uFF01\n" +
                    ("\u4ECA\u65E5\u306E\u51F8\u6B8B\u308A\u306F " + (凸残 === null || 凸残 === void 0 ? void 0 : 凸残.join(' ')) + " \u3088\n") +
                    ("`" + state.lap + "`\u5468\u76EE\u306E`" + state.boss + "`\u307E\u3067\u9032\u3093\u3060\u308F\n") +
                    "\u304A\u75B2\u308C\u69D8\uFF01\u6B21\u3082\u9811\u5F35\u308A\u306A\u3055\u3044");
                return [2];
        }
    });
}); };
