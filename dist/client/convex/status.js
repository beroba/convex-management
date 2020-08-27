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
exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var lapAndBoss = __importStar(require("./lapAndBoss"));
var date = __importStar(require("./date"));
var report = __importStar(require("./report"));
exports.Update = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, members, row, num_cell, over_cell, end_cell, end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                members = (_a.sent()).filter(function (v) { return v; });
                row = getMemberRow(members, msg.member);
                return [4, getCell(0, row, sheet)];
            case 3:
                num_cell = _a.sent();
                return [4, getCell(1, row, sheet)];
            case 4:
                over_cell = _a.sent();
                return [4, getCell(2, row, sheet)];
            case 5:
                end_cell = _a.sent();
                return [4, end_cell.getValue()];
            case 6:
                if (_a.sent())
                    return [2, msg.reply('もう3凸してるわ、お疲れ様')];
                return [4, statusUpdate(num_cell, over_cell, msg.content)];
            case 7:
                _a.sent();
                return [4, msg.react('❌')];
            case 8:
                _a.sent();
                return [4, isThreeConvex(num_cell, over_cell)];
            case 9:
                end = _a.sent();
                if (!end) return [3, 11];
                return [4, convexEndProcess(end_cell, members, sheet, msg)];
            case 10:
                _a.sent();
                return [3, 13];
            case 11: return [4, situationReport(num_cell, over_cell, msg)];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13: return [2];
        }
    });
}); };
var getMemberRow = function (cells, member) {
    return cells.indexOf(util.GetUserName(member)) + 3;
};
var getCell = function (n, row, sheet) {
    if (n === void 0) { n = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var col;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, date.GetColumn(n)];
                case 1:
                    col = _a.sent();
                    return [2, sheet.getCell("" + col + row)];
            }
        });
    });
};
var statusUpdate = function (num_cell, over_cell, content) { return __awaiter(void 0, void 0, void 0, function () {
    var num, _a, over;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = Number;
                return [4, num_cell.getValue()];
            case 1:
                num = _a.apply(void 0, [_b.sent()]);
                return [4, over_cell.getValue()];
            case 2:
                over = _b.sent();
                if (!/^kill/.test(content)) return [3, 9];
                return [4, lapAndBoss.Next()];
            case 3:
                _b.sent();
                if (!over) return [3, 5];
                return [4, over_cell.setValue()];
            case 4:
                _b.sent();
                return [3, 8];
            case 5: return [4, num_cell.setValue(num + 1)];
            case 6:
                _b.sent();
                return [4, over_cell.setValue(1)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [3, 13];
            case 9:
                if (!over) return [3, 11];
                return [4, over_cell.setValue()];
            case 10:
                _b.sent();
                return [3, 13];
            case 11: return [4, num_cell.setValue(num + 1)];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13: return [2];
        }
    });
}); };
var isThreeConvex = function (num_cell, over_cell) { return __awaiter(void 0, void 0, void 0, function () {
    var num, over;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, num_cell.getValue()];
            case 1:
                num = _a.sent();
                if (num !== '3')
                    return [2, false];
                return [4, over_cell.getValue()];
            case 2:
                over = _a.sent();
                if (over)
                    return [2, false];
                return [2, true];
        }
    });
}); };
var convexEndProcess = function (end_cell, members, sheet, msg) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4, getCell(2, 1, sheet)];
            case 3:
                people_cell = _b.sent();
                return [4, people_cell.getValue()];
            case 4:
                n = _b.sent();
                return [4, msg.reply(n + "\u4EBA\u76EE\u306E3\u51F8\u7D42\u4E86\u8005\u3088\uFF01")];
            case 5:
                _b.sent();
                if (!(Number(n) === members.length)) return [3, 7];
                return [4, report.AllConvex()];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2];
        }
    });
}); };
var situationReport = function (num_cell, over_cell, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var num, _a, over;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = Number;
                return [4, num_cell.getValue()];
            case 1:
                num = _a.apply(void 0, [_b.sent()]);
                return [4, over_cell.getValue()];
            case 2:
                over = _b.sent();
                return [4, msg.reply(num + "\u51F8\u76EE" + (over ? ' 持ち越し' : ''))];
            case 3:
                _b.sent();
                return [2];
        }
    });
}); };
