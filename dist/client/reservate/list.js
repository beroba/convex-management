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
exports.RevOnly = exports.AllOutput = exports.Output = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
exports.Output = function (num) { return __awaiter(void 0, void 0, void 0, function () {
    var list, table, boss, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, readReservateList()];
            case 1:
                list = _a.sent();
                return [4, readBossTable()];
            case 2:
                table = _a.sent();
                boss = takeBossName(num, table);
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(boss + "\n" + '```\n' + (createLerevateList(num, list) + "\n") + '```');
                return [2];
        }
    });
}); };
exports.AllOutput = function () { return __awaiter(void 0, void 0, void 0, function () {
    var list, table, text, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, readReservateList()];
            case 1:
                list = _a.sent();
                return [4, readBossTable()];
            case 2:
                table = _a.sent();
                text = 'abcde'.split('').map(function (c) {
                    var boss = takeBossName(c, table);
                    return boss + "\n" + '```\n' + (createLerevateList(c, list) + "\n") + '```';
                });
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(text);
                return [2];
        }
    });
}); };
exports.RevOnly = function (num) { return __awaiter(void 0, void 0, void 0, function () {
    var list, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, readReservateList()];
            case 1:
                list = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send('```\n' + (createLerevateList(num, list) + "\n") + '```');
                return [2];
        }
    });
}); };
var readReservateList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, cells;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].RESERVATE_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].RESERVATE_SHEET.RESERVATE_CELLS)];
            case 2:
                cells = _a.sent();
                return [2, util
                        .PiecesEach(cells, 8)
                        .filter(function (v) { return !/^,+$/.test(v.toString()); })
                        .filter(function (v) { return !v[0]; })];
        }
    });
}); };
var readBossTable = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, cells;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].INFORMATION_SHEET.BOSS_CELLS)];
            case 2:
                cells = _a.sent();
                return [2, util.PiecesEach(cells, 2).filter(function (v) { return !/^,+$/.test(v.toString()); })];
        }
    });
}); };
var takeBossName = function (num, table) {
    return table.filter(function (v) { return v[0] === num.toLowerCase(); })[0][1];
};
var createLerevateList = function (num, list) {
    var text = list
        .filter(function (l) { return l[4] === num; })
        .map(function (l) { return l[3] + " " + l[6] + " " + l[7]; })
        .join('\n');
    return text ? text : '予約者なし';
};