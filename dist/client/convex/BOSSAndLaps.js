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
exports.CurrentMessage = exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var util = __importStar(require("../../util"));
exports.Update = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, laps, BOSSNum, infoSheet, cells, BOSS, _b, laps_cell, BOSS_cell, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = __read(arg.replace('　', ' ').split(' '), 2), laps = _a[0], BOSSNum = _a[1];
                if (!/\d/.test(laps))
                    return [2, msg.reply('形式が違うわ、やりなおし！')];
                if (!/[a-e]|[A-E]/.test(BOSSNum))
                    return [2, msg.reply('形式が違うわ、やりなおし！')];
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                infoSheet = _e.sent();
                return [4, spreadsheet.GetCells(infoSheet, const_settings_1["default"].INFORMATION_SHEET.BOSS_CELLS)];
            case 2:
                cells = _e.sent();
                BOSS = util.PiecesEach(cells, 2).filter(function (v) { return v[0] === BOSSNum.toLowerCase(); })[0][1];
                _b = __read(const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELLS.split(':'), 2), laps_cell = _b[0], BOSS_cell = _b[1];
                return [4, infoSheet.getCell(laps_cell)];
            case 3: return [4, (_e.sent()).setValue(laps)];
            case 4:
                _e.sent();
                return [4, infoSheet.getCell(BOSS_cell)];
            case 5: return [4, (_e.sent()).setValue(BOSS)];
            case 6:
                _e.sent();
                _d = (_c = msg).reply;
                return [4, exports.CurrentMessage()];
            case 7:
                _d.apply(_c, [_e.sent()]);
                return [2];
        }
    });
}); };
exports.CurrentMessage = function () { return __awaiter(void 0, void 0, void 0, function () {
    var infoSheet, _a, laps, BOSS;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                infoSheet = _b.sent();
                return [4, spreadsheet.GetCells(infoSheet, const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELLS)];
            case 2:
                _a = __read.apply(void 0, [_b.sent(), 2]), laps = _a[0], BOSS = _a[1];
                return [2, "\u73FE\u5728\u3001`" + laps + "`\u5468\u76EE\u306E`" + BOSS + "`\u3088"];
        }
    });
}); };
