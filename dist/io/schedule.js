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
exports.ReflectOnCal = exports.EditOnSheet = exports.DeleteOnSheet = exports.AddToSheet = exports.FetchBoss = exports.Fetch = exports.Edit = exports.Delete = exports.Add = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var alphabet_to_number_1 = require("alphabet-to-number");
var io = __importStar(require("."));
var util = __importStar(require("../util"));
var spreadsheet = __importStar(require("../util/spreadsheet"));
exports.Add = function (plan) { return __awaiter(void 0, void 0, void 0, function () {
    var plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                plans.push(plan);
                return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS, plans)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
exports.Delete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var plans, plan;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                plan = plans.find(function (p) { return p.senderID === id; });
                if (!plan)
                    return [2];
                plans = plans.filter(function (p) { return p.senderID !== id; });
                return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS, plans)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
exports.Edit = function (text, id) { return __awaiter(void 0, void 0, void 0, function () {
    var plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                plans = plans.map(function (p) {
                    if (p.senderID !== id)
                        return p;
                    p.msg = text;
                    return p;
                });
                return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS, plans)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
exports.Fetch = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, io.Fetch(const_settings_1["default"].CAL_STATUS_ID.PLANS)];
}); }); };
exports.FetchBoss = function (alpha) { return __awaiter(void 0, void 0, void 0, function () {
    var plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                return [2, plans.filter(function (p) { return p.alpha === alpha; })];
        }
    });
}); };
exports.AddToSheet = function (plan) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, fetchPlansFromSheet(sheet)];
            case 2:
                plans = _a.sent();
                return [4, Promise.all(Object.values(plan).map(function (v, i) { return __awaiter(void 0, void 0, void 0, function () {
                        var cell;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, sheet.getCell("" + alphabet_to_number_1.AtoA('A', i) + (plans.length + 3))];
                                case 1:
                                    cell = _a.sent();
                                    return [4, cell.setValue(v)];
                                case 2:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
exports.DeleteOnSheet = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, plans, col, row, cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, fetchPlansFromSheet(sheet)];
            case 2:
                plans = _a.sent();
                col = const_settings_1["default"].PLAN_SHEET.DONE_COLUMN;
                row = plans.map(function (p) { return p.senderID; }).indexOf(id) + 3;
                if (row === 2)
                    return [2];
                return [4, sheet.getCell("" + col + row)];
            case 3:
                cell = _a.sent();
                cell.setValue('1');
                return [2];
        }
    });
}); };
exports.EditOnSheet = function (text, id) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, plans, col, row, cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, fetchPlansFromSheet(sheet)];
            case 2:
                plans = _a.sent();
                col = const_settings_1["default"].PLAN_SHEET.MESSAGE_COLUMN;
                row = plans.map(function (p) { return p.senderID; }).indexOf(id) + 3;
                if (row === 2)
                    return [2];
                return [4, sheet.getCell("" + col + row)];
            case 3:
                cell = _a.sent();
                cell.setValue(text);
                return [2];
        }
    });
}); };
exports.ReflectOnCal = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, plans, incomplete;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, fetchPlansFromSheet(sheet)];
            case 2:
                plans = _a.sent();
                incomplete = plans.filter(function (p) { return !p.done; });
                return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS, incomplete)];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
var fetchPlansFromSheet = function (sheet) { return __awaiter(void 0, void 0, void 0, function () {
    var cells;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].PLAN_SHEET.PLAN_CELLS)];
            case 1:
                cells = _a.sent();
                return [2, pieces_each_1["default"](cells, 9)
                        .filter(util.Omit)
                        .map(function (p) { return ({
                        done: p[0],
                        senderID: p[1],
                        calID: p[2],
                        name: p[3],
                        playerID: p[4],
                        num: p[5],
                        alpha: p[6],
                        boss: p[7],
                        msg: p[8]
                    }); })];
        }
    });
}); };
