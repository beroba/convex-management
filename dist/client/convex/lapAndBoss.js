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
exports.ProgressReport = exports.GetCurrent = exports.Previous = exports.Next = exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var list = __importStar(require("../plan/list"));
var category = __importStar(require("../command/category"));
exports.Update = function (arg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lap, num, sheet, boss, _b, lap_cell, boss_cell, num_cell;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = __read(arg.replace(/　/g, ' ').split(' '), 2), lap = _a[0], num = _a[1];
                if (!/\d/.test(lap))
                    return [2, false];
                if (!/[a-e]/i.test(num))
                    return [2, false];
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _c.sent();
                return [4, readBossName(sheet, num)];
            case 2:
                boss = _c.sent();
                _b = __read(readCurrentCell(sheet), 3), lap_cell = _b[0], boss_cell = _b[1], num_cell = _b[2];
                return [4, spreadsheet.SetValue(lap_cell, lap)];
            case 3:
                _c.sent();
                return [4, spreadsheet.SetValue(boss_cell, boss)];
            case 4:
                _c.sent();
                return [4, spreadsheet.SetValue(num_cell, num)];
            case 5:
                _c.sent();
                exports.ProgressReport();
                switchBossRole(num);
                stageConfirm();
                return [2, true];
        }
    });
}); };
exports.Next = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, _a, lap_cell, boss_cell, num_cell, _b, lap, boss, num;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _c.sent();
                _a = __read(readCurrentCell(sheet), 3), lap_cell = _a[0], boss_cell = _a[1], num_cell = _a[2];
                return [4, readForwardDate(lap_cell, num_cell, sheet)];
            case 2:
                _b = __read.apply(void 0, [_c.sent(), 3]), lap = _b[0], boss = _b[1], num = _b[2];
                return [4, spreadsheet.SetValue(lap_cell, lap)];
            case 3:
                _c.sent();
                return [4, spreadsheet.SetValue(boss_cell, boss)];
            case 4:
                _c.sent();
                return [4, spreadsheet.SetValue(num_cell, num)];
            case 5:
                _c.sent();
                exports.ProgressReport();
                switchBossRole(num);
                stageConfirm();
                return [2];
        }
    });
}); };
exports.Previous = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, _a, lap_cell, boss_cell, num_cell, _b, lap, boss, num;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _c.sent();
                _a = __read(readCurrentCell(sheet), 3), lap_cell = _a[0], boss_cell = _a[1], num_cell = _a[2];
                return [4, readReturnDate(lap_cell, num_cell, sheet)];
            case 2:
                _b = __read.apply(void 0, [_c.sent(), 3]), lap = _b[0], boss = _b[1], num = _b[2];
                return [4, spreadsheet.SetValue(lap_cell, lap)];
            case 3:
                _c.sent();
                return [4, spreadsheet.SetValue(boss_cell, boss)];
            case 4:
                _c.sent();
                return [4, spreadsheet.SetValue(num_cell, num)];
            case 5:
                _c.sent();
                exports.ProgressReport();
                switchBossRole(num);
                stageConfirm();
                return [2];
        }
    });
}); };
exports.GetCurrent = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, range, _a, lap, boss, cells, num;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                range = const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELL.split(',');
                return [4, spreadsheet.GetCells(sheet, range[0] + ":" + range[1])];
            case 2:
                _a = __read.apply(void 0, [_b.sent(), 2]), lap = _a[0], boss = _a[1];
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].INFORMATION_SHEET.BOSS_CELLS)];
            case 3:
                cells = _b.sent();
                num = pieces_each_1["default"](cells, 2).filter(function (v) { return v[1] === boss; })[0][0];
                return [2, { lap: lap, boss: boss, num: num }];
        }
    });
}); };
exports.ProgressReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var state, role, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.GetCurrent()];
            case 1:
                state = _a.sent();
                role = const_settings_1["default"].BOSS_ROLE_ID[state.num];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send("<@&" + role + ">\n`" + state.lap + "`\u5468\u76EE `" + state.boss + "`");
                list.PlanOnly(state.num);
                return [2];
        }
    });
}); };
var switchBossRole = function (num) {
    var _a;
    var cal = (_a = util.GetGuild()) === null || _a === void 0 ? void 0 : _a.members.cache.get(const_settings_1["default"].CAL_ID);
    Object.values(const_settings_1["default"].BOSS_ROLE_ID).forEach(function (id) { return cal === null || cal === void 0 ? void 0 : cal.roles.remove(id); });
    cal === null || cal === void 0 ? void 0 : cal.roles.add(const_settings_1["default"].BOSS_ROLE_ID[num]);
    console.log("Switch Cal's boss role");
};
var readBossName = function (sheet, num) { return __awaiter(void 0, void 0, void 0, function () {
    var cells;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].INFORMATION_SHEET.BOSS_CELLS)];
            case 1:
                cells = _a.sent();
                return [2, pieces_each_1["default"](cells, 2).filter(function (v) { return v[0] === num.toLowerCase(); })[0][1]];
        }
    });
}); };
var readCurrentCell = function (sheet) {
    return const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELL.split(',').map(function (cell) { return sheet.getCell(cell); });
};
var readForwardDate = function (lap_cell, num_cell, sheet) { return __awaiter(void 0, void 0, void 0, function () {
    var lap, num, numberList, n, boss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetValue(lap_cell)];
            case 1:
                lap = _a.sent();
                return [4, spreadsheet.GetValue(num_cell)];
            case 2:
                num = _a.sent();
                numberList = ['a', 'b', 'c', 'd', 'e'];
                n = (function (n) { return (n === 4 ? 0 : n + 1); })(numberList.indexOf(num));
                return [4, readBossName(sheet, numberList[n])];
            case 3:
                boss = _a.sent();
                return [2, [n ? lap : Number(lap) + 1, boss, numberList[n]]];
        }
    });
}); };
var readReturnDate = function (lap_cell, num_cell, sheet) { return __awaiter(void 0, void 0, void 0, function () {
    var lap, num, numberList, n, boss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetValue(lap_cell)];
            case 1:
                lap = _a.sent();
                return [4, spreadsheet.GetValue(num_cell)];
            case 2:
                num = _a.sent();
                numberList = ['a', 'b', 'c', 'd', 'e'];
                n = (function (n) { return (n === 0 ? 4 : n - 1); })(numberList.indexOf(num));
                return [4, readBossName(sheet, numberList[n])];
            case 3:
                boss = _a.sent();
                return [2, [n === 4 ? Number(lap) - 1 : lap, boss, numberList[n]]];
        }
    });
}); };
var stageConfirm = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, range, _a, lap, num, stage, cells, _b, col;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _c.sent();
                range = const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELL.split(',');
                return [4, spreadsheet.GetCells(sheet, range[0] + ":" + range[2])];
            case 2:
                _a = __read.apply(void 0, [_c.sent(), 3]), lap = _a[0], num = _a[2];
                stage = getStageNow(Number(lap));
                switchStageRole(stage);
                if (num !== 'a')
                    return [2];
                _b = pieces_each_1["default"];
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].INFORMATION_SHEET.STAGE_CELLS)];
            case 3:
                cells = _b.apply(void 0, [_c.sent(), 2]);
                col = const_settings_1["default"].INFORMATION_SHEET.STAGE_COLUMN;
                switch (lap) {
                    case '4': {
                        if (cells[1][1])
                            return [2];
                        return [2, fetchStage(2, sheet, col)];
                    }
                    case '11': {
                        if (cells[2][1])
                            return [2];
                        return [2, fetchStage(3, sheet, col)];
                    }
                    case '35': {
                        if (cells[3][1])
                            return [2];
                        return [2, fetchStage(4, sheet, col)];
                    }
                    case '45': {
                        if (cells[4][1])
                            return [2];
                        return [2, fetchStage(5, sheet, col)];
                    }
                }
                return [2];
        }
    });
}); };
var getStageNow = function (lap) {
    switch (true) {
        case lap < 4:
            return 'first';
        case lap < 11:
            return 'second';
        case lap < 35:
            return 'third';
        case lap < 45:
            return 'fourth';
        default:
            return 'fifth';
    }
};
var switchStageRole = function (stage) {
    var _a;
    var cal = (_a = util.GetGuild()) === null || _a === void 0 ? void 0 : _a.members.cache.get(const_settings_1["default"].CAL_ID);
    Object.values(const_settings_1["default"].STAGE_ROLE_ID).forEach(function (id) { return cal === null || cal === void 0 ? void 0 : cal.roles.remove(id); });
    cal === null || cal === void 0 ? void 0 : cal.roles.add(const_settings_1["default"].STAGE_ROLE_ID[stage]);
    console.log("Switch Cal's stage role");
};
var fetchStage = function (n, sheet, col) { return __awaiter(void 0, void 0, void 0, function () {
    var cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (n < 5)
                    category.SetSeparate(n);
                return [4, sheet.getCell("" + col + (n + 2))];
            case 1:
                cell = _a.sent();
                cell.setValue(1);
                return [2];
        }
    });
}); };
