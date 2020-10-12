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
exports.GetCell = exports.GetMemberRow = exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var alphabet_to_number_1 = require("alphabet-to-number");
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var date = __importStar(require("../convex/date"));
var lapAndBoss = __importStar(require("../convex/lapAndBoss"));
var report = __importStar(require("../convex/report"));
exports.Update = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, cells, members, row, days, num_cell, over_cell, end_cell, hist_cell, content, end;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                cells = _b.sent();
                members = pieces_each_1["default"](cells, 2).filter(function (v) { return v; });
                row = exports.GetMemberRow(members, ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.id) || '');
                return [4, date.CheckCalnBattle()];
            case 3:
                days = _b.sent();
                return [4, exports.GetCell(0, row, sheet, days)];
            case 4:
                num_cell = _b.sent();
                return [4, exports.GetCell(1, row, sheet, days)];
            case 5:
                over_cell = _b.sent();
                return [4, exports.GetCell(2, row, sheet, days)];
            case 6:
                end_cell = _b.sent();
                return [4, exports.GetCell(3, row, sheet, days)];
            case 7:
                hist_cell = _b.sent();
                if (end_cell.getValue())
                    return [2, true];
                saveHistory(num_cell, over_cell, hist_cell);
                content = util.Format(msg.content);
                statusUpdate(num_cell, over_cell, content);
                msg.react(const_settings_1["default"].EMOJI_ID.TORIKESHI);
                return [4, isThreeConvex(num_cell, over_cell)];
            case 8:
                end = _b.sent();
                if (end) {
                    convexEndProcess(end_cell, members.length, sheet, days, msg);
                }
                else {
                    situationReport(num_cell, over_cell, msg);
                }
                return [2];
        }
    });
}); };
exports.GetMemberRow = function (members, id) { return members.map(function (v) { return v[1]; }).indexOf(id) + 3; };
exports.GetCell = function (n, row, sheet, days) {
    if (n === void 0) { n = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var col;
        return __generator(this, function (_a) {
            col = alphabet_to_number_1.AtoA(days[2], n);
            return [2, sheet.getCell("" + col + row)];
        });
    });
};
var saveHistory = function (num_cell, over_cell, hist_cell) { return __awaiter(void 0, void 0, void 0, function () {
    var num, over;
    return __generator(this, function (_a) {
        num = num_cell.getValue();
        over = over_cell.getValue();
        hist_cell.setValue("" + num + (over ? "," + over : ''));
        return [2];
    });
}); };
var statusUpdate = function (num_cell, over_cell, content) {
    var num = Number(num_cell.getValue());
    var over = over_cell.getValue();
    if (/^k|kill/i.test(content)) {
        lapAndBoss.Next();
        if (over) {
            over_cell.setValue();
        }
        else {
            num_cell.setValue(num + 1);
            over_cell.setValue(1);
        }
    }
    else {
        if (over) {
            over_cell.setValue();
        }
        else {
            num_cell.setValue(num + 1);
        }
    }
};
var isThreeConvex = function (num_cell, over_cell) { return __awaiter(void 0, void 0, void 0, function () {
    var num, over;
    return __generator(this, function (_a) {
        num = num_cell.getValue();
        if (num !== '3')
            return [2, false];
        over = over_cell.getValue();
        if (over)
            return [2, false];
        return [2, true];
    });
}); };
var convexEndProcess = function (end_cell, people, sheet, days, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var people_cell, n;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, end_cell.setValue(1)];
            case 1:
                _b.sent();
                return [4, ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX))];
            case 2:
                _b.sent();
                return [4, exports.GetCell(2, 1, sheet, days)];
            case 3:
                people_cell = _b.sent();
                n = people_cell.getValue();
                return [4, msg.reply("3\u51F8\u76EE \u7D42\u4E86\n`" + n + "`\u4EBA\u76EE\u306E3\u51F8\u7D42\u4E86\u3088\uFF01")];
            case 4:
                _b.sent();
                if (!(Number(n) === people)) return [3, 6];
                return [4, report.AllConvex()];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [2];
        }
    });
}); };
var situationReport = function (num_cell, over_cell, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var num, over;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                num = Number(num_cell.getValue());
                over = over_cell.getValue();
                return [4, msg.reply(num + "\u51F8\u76EE " + (over ? '持ち越し' : '終了'))];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
