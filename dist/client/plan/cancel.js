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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.AllComplete = exports.Report = exports.Delete = exports.Already = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var alphabet_to_number_1 = require("alphabet-to-number");
var bossTable = __importStar(require("../../io/bossTable"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var list = __importStar(require("./list"));
exports.Already = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.KANRYOU)
                    return [2];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages.fetch(react.message.id)];
            case 1:
                _a.sent();
                if (react.message.author.id !== user.id)
                    return [2];
                react.message["delete"]();
                return [2, 'Already completed message'];
        }
    });
}); };
exports.Delete = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (msg.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE)
                    return [2];
                if (msg.author.bot)
                    return [2];
                return [4, planComplete(msg)];
            case 1:
                _a.sent();
                return [4, list.SituationEdit()];
            case 2:
                _a.sent();
                return [2, 'Delete completed message'];
        }
    });
}); };
exports.Report = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var content, num, sheet, cells, id, plans;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                content = util.Format(msg.content);
                return [4, checkBossNumber(content)];
            case 1:
                num = _b.sent();
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 2:
                sheet = _b.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].PLAN_SHEET.PLAN_CELLS)];
            case 3:
                cells = _b.sent();
                id = readPlanMessageId(cells, msg.author.id, num);
                if (!id)
                    return [2];
                return [4, convexComplete(sheet, cells, id)];
            case 4:
                _b.sent();
                msgDelete(pieces_each_1["default"](cells, 8).filter(function (v) { return v[1] === id; })[0][1]);
                msgDelete(pieces_each_1["default"](cells, 8).filter(function (v) { return v[1] === id; })[0][2]);
                plans = pieces_each_1["default"](cells, 8)
                    .filter(function (c) { return c[4] === msg.author.id; })
                    .filter(function (v) { return v[5] === num; })
                    .filter(function (c) { return !c[0]; });
                if (plans.length <= 1) {
                    (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.remove(const_settings_1["default"].BOSS_ROLE_ID[num]);
                }
                console.log('Delete completed message');
                return [2];
        }
    });
}); };
exports.AllComplete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, list, sleep, list_1, list_1_1, m, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages.fetch()];
            case 1:
                list = (_b.sent()).map(function (v) { return v; }).filter(function (m) { return m.author.id === id; });
                sleep = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, 8, 9]);
                list_1 = __values(list), list_1_1 = list_1.next();
                _b.label = 3;
            case 3:
                if (!!list_1_1.done) return [3, 6];
                m = list_1_1.value;
                m["delete"]();
                return [4, sleep(10000)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                list_1_1 = list_1.next();
                return [3, 3];
            case 6: return [3, 9];
            case 7:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 9];
            case 8:
                try {
                    if (list_1_1 && !list_1_1.done && (_a = list_1["return"])) _a.call(list_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 9:
                console.log('Delete all convex schedules');
                return [2];
        }
    });
}); };
var planComplete = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, cells, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].PLAN_SHEET.PLAN_CELLS)];
            case 2:
                cells = _a.sent();
                return [4, convexComplete(sheet, cells, msg.id)];
            case 3:
                _a.sent();
                id = pieces_each_1["default"](cells, 8).filter(function (v) { return v[1] === msg.id; })[0][2];
                return [4, msgDelete(id)];
            case 4:
                _a.sent();
                deleteBossRole(cells, msg);
                return [2];
        }
    });
}); };
var msgDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages
                        .fetch(id)
                        .then(function (m) { return m; })["catch"](function (_) { return undefined; })];
            case 1:
                msg = _a.sent();
                if (!msg)
                    return [2];
                msg["delete"]();
                return [2];
        }
    });
}); };
var convexComplete = function (sheet, cells, id) { return __awaiter(void 0, void 0, void 0, function () {
    var row, cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                row = pieces_each_1["default"](cells, 8)
                    .map(function (v) { return v[1]; })
                    .indexOf(id) + 3;
                if (row === 2)
                    return [2];
                return [4, sheet.getCell("A" + row)];
            case 1:
                cell = _a.sent();
                cell.setValue('1');
                return [2];
        }
    });
}); };
var deleteBossRole = function (cells, msg) {
    var _a;
    var num = pieces_each_1["default"](cells, 8).filter(function (v) { return v[1] === msg.id; })[0][5];
    var plans = pieces_each_1["default"](cells, 8)
        .filter(function (c) { return c[4] === msg.author.id; })
        .filter(function (v) { return v[5] === num; })
        .filter(function (c) { return !c[0]; });
    if (plans.length > 1)
        return;
    (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.remove(const_settings_1["default"].BOSS_ROLE_ID[num]);
};
var checkBossNumber = function (content) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, alpha, num, range;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, bossTable.TakeAlpha(content)];
            case 2:
                alpha = _a.sent();
                if (alpha)
                    return [2, alpha];
                num = content.replace(/kill/i, '').replace(/^k/i, '').trim()[0];
                if (/[1-5]/.test(num))
                    return [2, alphabet_to_number_1.NtoA(num)];
                if (/[a-e]/i.test(num))
                    return [2, num];
                range = const_settings_1["default"].INFORMATION_SHEET.CURRENT_CELL.split(',');
                return [4, sheet.getCell(range[2])];
            case 3: return [2, (_a.sent()).getValue()];
        }
    });
}); };
var readPlanMessageId = function (cells, id, num) {
    var plans = pieces_each_1["default"](cells, 8)
        .filter(function (c) { return c[4] === id; })
        .filter(function (c) { return !c[0]; });
    var index = plans.findIndex(function (v) { return v[5] === num; });
    if (index === -1)
        return;
    return plans[index][1];
};
