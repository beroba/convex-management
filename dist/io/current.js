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
exports.ReflectOnCal = exports.ReflectOnSheet = exports.Fetch = exports.UpdateBossHp = exports.UpdateLapAndBoss = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var spreadsheet = __importStar(require("../util/spreadsheet"));
var io = __importStar(require("."));
var bossTable = __importStar(require("./bossTable"));
exports.UpdateLapAndBoss = function (lap, alpha) { return __awaiter(void 0, void 0, void 0, function () {
    var state, num, boss;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                state = _a.sent();
                state.lap = lap;
                state.stage = getStageName(lap);
                state.alpha = alpha;
                return [4, bossTable.TakeNum(alpha)];
            case 2:
                num = _a.sent();
                if (!num)
                    return [2];
                state.num = num;
                return [4, bossTable.TakeName(alpha)];
            case 3:
                boss = _a.sent();
                if (!boss)
                    return [2];
                state.boss = boss;
                state.hp = const_settings_1["default"].STAGE_HP[state.stage][alpha];
                return [4, io.UpdateJson(const_settings_1["default"].CAL_STATUS_ID.CURRENT, state)];
            case 4:
                _a.sent();
                return [2, state];
        }
    });
}); };
var getStageName = function (lap) {
    var l = Number(lap);
    switch (true) {
        case l < 4:
            return 'first';
        case l < 11:
            return 'second';
        case l < 35:
            return 'third';
        case l < 45:
            return 'fourth';
        default:
            return 'fifth';
    }
};
exports.UpdateBossHp = function (hp) { return __awaiter(void 0, void 0, void 0, function () {
    var state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                state = _a.sent();
                state.hp = hp;
                return [4, io.UpdateJson(const_settings_1["default"].CAL_STATUS_ID.CURRENT, state)];
            case 2:
                _a.sent();
                return [2, state];
        }
    });
}); };
exports.Fetch = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2, io.Fetch(const_settings_1["default"].CAL_STATUS_ID.CURRENT)];
}); }); };
exports.ReflectOnSheet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var state, sheet, _a, lap, boss, alpha, lap_cell, boss_cell, alpha_cell;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                state = _b.sent();
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 2:
                sheet = _b.sent();
                _a = __read(const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELL.split(','), 3), lap = _a[0], boss = _a[1], alpha = _a[2];
                return [4, sheet.getCell(lap)];
            case 3:
                lap_cell = _b.sent();
                lap_cell.setValue(state.lap);
                return [4, sheet.getCell(boss)];
            case 4:
                boss_cell = _b.sent();
                boss_cell.setValue(state.boss);
                return [4, sheet.getCell(alpha)];
            case 5:
                alpha_cell = _b.sent();
                alpha_cell.setValue(state.alpha);
                return [2];
        }
    });
}); };
exports.ReflectOnCal = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, _a, lap_cell, alpha_cell, lap, alpha;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                _a = __read(const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELL.split(','), 3), lap_cell = _a[0], alpha_cell = _a[2];
                return [4, sheet.getCell(lap_cell)];
            case 2:
                lap = (_b.sent()).getValue();
                return [4, sheet.getCell(alpha_cell)];
            case 3:
                alpha = (_b.sent()).getValue();
                return [4, exports.UpdateLapAndBoss(lap, alpha)];
            case 4:
                _b.sent();
                return [2];
        }
    });
}); };
