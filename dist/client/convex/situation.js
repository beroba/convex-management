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
exports.Report = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var alphabet_to_number_1 = require("alphabet-to-number");
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var lapAndBoss = __importStar(require("./lapAndBoss"));
var date = __importStar(require("./date"));
exports.Report = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, days, range, status, _a, cells, members, list, currentText, situation, msg, history;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                return [4, date.CheckCalnBattle()];
            case 2:
                days = _b.sent();
                range = days[2] + "3:" + alphabet_to_number_1.AtoA(days[2], 1) + "32";
                _a = pieces_each_1["default"];
                return [4, spreadsheet.GetCells(sheet, range)];
            case 3:
                status = _a.apply(void 0, [(_b.sent()).map(Number), 2]);
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 4:
                cells = _b.sent();
                members = pieces_each_1["default"](cells, 2).filter(function (v) { return v; });
                list = mergeList(status, members);
                return [4, createMessage(list)];
            case 5:
                currentText = _b.sent();
                situation = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_SITUATION);
                return [4, situation.messages.fetch(const_settings_1["default"].CONVEX_MESSAGE_ID.SITUATION)];
            case 6:
                msg = _b.sent();
                msg.edit(currentText);
                history = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_HISTORY);
                history.send(currentText);
                console.log('Report convex situation');
                return [2];
        }
    });
}); };
var mergeList = function (status, members) {
    return status
        .map(function (v, i) { return ({
        member: members[i][0],
        number: v[0],
        over: v[1]
    }); })
        .filter(function (v) { return v.member !== ''; });
};
var createMessage = function (list) { return __awaiter(void 0, void 0, void 0, function () {
    var time, day, state, current, remaining, 未凸, 持越1, 凸1, 持越2, 凸2, 持越3, 凸3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                time = getCurrentDate();
                return [4, date.GetDay()];
            case 1:
                day = (_a.sent()) + "\u65E5\u76EE";
                return [4, lapAndBoss.GetCurrent()];
            case 2:
                state = _a.sent();
                current = "`" + state.lap + "`\u5468\u76EE\u306E`" + state.boss + "`";
                remaining = remainingConvexNumber(list);
                未凸 = userSorting(list, 0, 0);
                持越1 = userSorting(list, 1, 1);
                凸1 = userSorting(list, 1, 0);
                持越2 = userSorting(list, 2, 1);
                凸2 = userSorting(list, 2, 0);
                持越3 = userSorting(list, 3, 1);
                凸3 = userSorting(list, 3, 0);
                return [2, ("`" + time + "` " + day + " \u51F8\u72B6\u6CC1\u4E00\u89A7\n" +
                        (current + " `" + remaining + "`\n") +
                        '```\n' +
                        ("\u672A\u51F8: " + 未凸 + "\n") +
                        '\n' +
                        ("\u6301\u8D8A: " + 持越1 + "\n") +
                        ("1\u51F8 : " + 凸1 + "\n") +
                        '\n' +
                        ("\u6301\u8D8A: " + 持越2 + "\n") +
                        ("2\u51F8 : " + 凸2 + "\n") +
                        '\n' +
                        ("\u6301\u8D8A: " + 持越3 + "\n") +
                        ("3\u51F8 : " + 凸3 + "\n") +
                        '\n' +
                        '```')];
        }
    });
}); };
var getCurrentDate = function () {
    var p0 = function (n) { return (n + '').padStart(2, '0'); };
    var d = new Date();
    return p0(d.getMonth() + 1) + "/" + p0(d.getDate()) + " " + p0(d.getHours()) + ":" + p0(d.getMinutes());
};
var userSorting = function (list, number, over) {
    return list
        .filter(function (l) { return l.number === number; })
        .filter(function (l) { return l.over === over; })
        .map(function (l) { return l.member; })
        .join(', ');
};
var remainingConvexNumber = function (list) {
    var remaining = list.map(function (l) { return 3 - l.number + l.over; }).reduce(function (a, b) { return a + b; });
    var over = list.map(function (l) { return l.over; }).reduce(function (a, b) { return a + b; });
    return remaining + "/" + list.length * 3 + "(" + over + ")";
};
