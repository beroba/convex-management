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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var date = __importStar(require("./date"));
var status = __importStar(require("../report/status"));
exports.Update = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, convex, sheet, cells, members, row, name, days, people_cell, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = __read(util.Format(arg).split(' '), 2), id = _a[0], convex = _a[1];
                if (!convexFormatConfirm(convex)) {
                    msg.reply('凸状況の書式が違うわ');
                    return [2, false];
                }
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                sheet = _f.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                cells = _f.sent();
                members = pieces_each_1["default"](cells, 2).filter(function (v) { return v; });
                row = status.GetMemberRow(members, id || '');
                if (row === 2) {
                    msg.reply('クランメンバーにそのidの人は居なかったわよ');
                    return [2, false];
                }
                name = members.filter(function (m) { return m[1] === id; })[0][0];
                if (!(convex === '3')) return [3, 6];
                return [4, date.CheckCalnBattle()];
            case 3:
                days = _f.sent();
                return [4, status.GetCell(2, 1, sheet, days)];
            case 4:
                people_cell = _f.sent();
                _b = convexEndProcess;
                return [4, readCells(row, sheet)];
            case 5:
                _b.apply(void 0, [_f.sent(), people_cell, name]);
                (_d = msg.member) === null || _d === void 0 ? void 0 : _d.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX);
                return [3, 8];
            case 6:
                _c = updateProcess;
                return [4, readCells(row, sheet)];
            case 7:
                _c.apply(void 0, [_f.sent(), convex, name]);
                (_e = msg.member) === null || _e === void 0 ? void 0 : _e.roles.add(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX);
                _f.label = 8;
            case 8: return [2, true];
        }
    });
}); };
var convexFormatConfirm = function (convex) {
    if (convex[0] === '0')
        return convex.length === 1 ? true : false;
    return /^[1-3]/.test(convex[0]);
};
var readCells = function (row, sheet) { return __awaiter(void 0, void 0, void 0, function () {
    var days, num_cell, over_cell, end_cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, date.CheckCalnBattle()];
            case 1:
                days = _a.sent();
                return [4, status.GetCell(0, row, sheet, days)];
            case 2:
                num_cell = _a.sent();
                return [4, status.GetCell(1, row, sheet, days)];
            case 3:
                over_cell = _a.sent();
                return [4, status.GetCell(2, row, sheet, days)];
            case 4:
                end_cell = _a.sent();
                return [2, [num_cell, over_cell, end_cell]];
        }
    });
}); };
var convexEndProcess = function (cells, people_cell, name) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, num_cell, over_cell, end_cell, n, channel;
    return __generator(this, function (_b) {
        _a = __read(__spread(cells), 3), num_cell = _a[0], over_cell = _a[1], end_cell = _a[2];
        num_cell.setValue(3);
        over_cell.setValue('');
        end_cell.setValue('1');
        n = Number(people_cell.getValue()) + 1;
        channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
        channel.send(name + ", 3\u51F8\u76EE \u7D42\u4E86\n`" + n + "`\u4EBA\u76EE\u306E3\u51F8\u7D42\u4E86\u3088\uFF01");
        return [2];
    });
}); };
var updateProcess = function (cells, convex, name) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, num_cell, over_cell, end_cell, _b, num, over, channel;
    return __generator(this, function (_c) {
        _a = __read(__spread(cells), 3), num_cell = _a[0], over_cell = _a[1], end_cell = _a[2];
        _b = __read(convex.length === 1
            ? [convex === '0' ? '' : convex, '']
            : __spread(convex
                .replace(/ /g, '')
                .split(',')
                .map(function (n) { return (n === '0' ? '' : n); })), 2), num = _b[0], over = _b[1];
        num_cell.setValue(num);
        over_cell.setValue(over);
        end_cell.setValue('');
        channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
        channel.send(name + ", " + (num ? num + "\u51F8\u76EE " + (over ? '持ち越し' : '終了') : '未凸'));
        return [2];
    });
}); };
