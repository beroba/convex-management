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
var situation = __importStar(require("./situation"));
var date = __importStar(require("./date"));
exports.Update = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, cellUpdate(msg.content, msg)];
            case 1:
                _c.sent();
                return [4, msg.react('❌')];
            case 2:
                _c.sent();
                if (!(msg.content.charAt(0) === '3')) return [3, 4];
                return [4, threeConvexEnd(msg)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_REPORT);
                _b = (_a = channel).send;
                return [4, lapAndBoss.CurrentMessage()];
            case 5:
                _b.apply(_a, [_c.sent()]);
                return [4, situation.Report()];
            case 6:
                _c.sent();
                return [2];
        }
    });
}); };
var getMemberRow = function (cells, member) {
    return cells.indexOf(util.GetUserName(member)) + 3;
};
var updateCellValue = function (sheet, col, row, val) {
    if (val === void 0) { val = ''; }
    return __awaiter(void 0, void 0, void 0, function () {
        var cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, sheet.getCell("" + col + row)];
                case 1:
                    cell = _a.sent();
                    return [4, cell.setValue(val)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
};
var fetchCellValue = function (sheet, col, row) { return __awaiter(void 0, void 0, void 0, function () {
    var cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, sheet.getCell("" + col + row)];
            case 1:
                cell = _a.sent();
                return [2, cell.getValue()];
        }
    });
}); };
var cellUpdate = function (content, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var val, manageSheet, cells, num_col, over_col, hist_col, row, over;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                val = content.replace('　', ' ').split(' ');
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                manageSheet = _a.sent();
                return [4, spreadsheet.GetCells(manageSheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                cells = _a.sent();
                return [4, date.GetColumn(0)];
            case 3:
                num_col = _a.sent();
                return [4, date.GetColumn(1)];
            case 4:
                over_col = _a.sent();
                return [4, date.GetColumn(2)];
            case 5:
                hist_col = _a.sent();
                row = getMemberRow(cells, msg.member);
                return [4, updateCellValue(manageSheet, hist_col, row, content)];
            case 6:
                _a.sent();
                return [4, updateCellValue(manageSheet, num_col, row, val[0])];
            case 7:
                _a.sent();
                return [4, fetchCellValue(manageSheet, over_col, row)];
            case 8:
                over = _a.sent();
                if (!(val.length === 1)) return [3, 11];
                if (!over) return [3, 10];
                return [4, updateCellValue(manageSheet, over_col, row)];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10: return [2];
            case 11: return [4, lapAndBoss.Next()];
            case 12:
                _a.sent();
                if (!over) return [3, 14];
                return [4, updateCellValue(manageSheet, over_col, row)];
            case 13:
                _a.sent();
                return [3, 16];
            case 14: return [4, updateCellValue(manageSheet, over_col, row, 1)];
            case 15:
                _a.sent();
                _a.label = 16;
            case 16: return [2];
        }
    });
}); };
var threeConvexEnd = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var manageSheet, cells, col, row, c, over, cell, n;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                manageSheet = _b.sent();
                return [4, spreadsheet.GetCells(manageSheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                cells = _b.sent();
                return [4, date.GetColumn(2)];
            case 3:
                col = _b.sent();
                row = getMemberRow(cells, msg.member);
                if (!(msg.content !== '3')) return [3, 7];
                return [4, date.GetColumn(1)];
            case 4:
                c = _b.sent();
                return [4, manageSheet.getCell("" + c + row)];
            case 5:
                over = _b.sent();
                return [4, over.getValue()];
            case 6:
                if (_b.sent())
                    return [2];
                _b.label = 7;
            case 7: return [4, manageSheet.getCell("" + col + row)];
            case 8:
                cell = _b.sent();
                return [4, cell.setValue(1)];
            case 9:
                _b.sent();
                return [4, ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX))];
            case 10:
                _b.sent();
                return [4, manageSheet.getCell(col + "1")];
            case 11:
                n = (_b.sent()).getValue();
                msg.reply(n + "\u4EBA\u76EE\u306E3\u51F8\u7D42\u4E86\u8005\u3088\uFF01");
                if (Number(n) !== cells.filter(function (v) { return v; }).length)
                    return [2];
                return [4, allConvexReport()];
            case 12:
                _b.sent();
                console.log('Complete convex end report');
                return [2];
        }
    });
}); };
var allConvexReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var day, state, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _a.sent();
                return [4, lapAndBoss.GetCurrent()];
            case 2:
                state = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(day + "\u65E5\u76EE\u306E\u5168\u51F8\u7D42\u4E86\u5831\u544A\u3088\uFF01\n" +
                    ("\u4ECA\u65E5\u306F`" + state.lap + "`\u5468\u76EE\u306E`" + state.boss + "`\u307E\u3067\u9032\u3093\u3060\u308F\n") +
                    "\u304A\u75B2\u308C\u69D8\uFF01\u6B21\u3082\u9811\u5F35\u308A\u306A\u3055\u3044");
                return [2];
        }
    });
}); };
