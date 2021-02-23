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
exports.Switch = exports.Remove = exports.Add = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var alphabet_to_number_1 = require("alphabet-to-number");
var status = __importStar(require("../../io/status"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
exports.Add = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member, day, section;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME)
                    return [2];
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _a.sent();
                if (!member) {
                    react.users.remove(user);
                    return [2];
                }
                day = confirmDays(react.message.id);
                if (!day) {
                    react.users.remove(user);
                    return [2];
                }
                section = confirmSection(react.emoji.id);
                if (!section) {
                    react.users.remove(user);
                    return [2];
                }
                changeValueOfSheet('1', day, section, user);
                return [2, 'Activity time questionnaire add'];
        }
    });
}); };
exports.Remove = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member, day, section;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME)
                    return [2];
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _a.sent();
                if (!member) {
                    react.users.remove(user);
                    return [2];
                }
                day = confirmDays(react.message.id);
                if (!day) {
                    react.users.remove(user);
                    return [2];
                }
                section = confirmSection(react.emoji.id);
                if (!section) {
                    react.users.remove(user);
                    return [2];
                }
                changeValueOfSheet('', day, section, user);
                return [2, 'Activity time questionnaire remove'];
        }
    });
}); };
var confirmDays = function (id) {
    return id === const_settings_1["default"].ACTIVITY_TIME.DAYS.DAY1 ? 1 :
        id === const_settings_1["default"].ACTIVITY_TIME.DAYS.DAY2 ? 2 :
            id === const_settings_1["default"].ACTIVITY_TIME.DAYS.DAY3 ? 3 :
                id === const_settings_1["default"].ACTIVITY_TIME.DAYS.DAY4 ? 4 :
                    id === const_settings_1["default"].ACTIVITY_TIME.DAYS.DAY5 ? 5 :
                        null;
};
var confirmSection = function (id) {
    return id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._1 ? 1 :
        id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._2 ? 2 :
            id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._3 ? 3 :
                id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._4 ? 4 :
                    id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._5 ? 5 :
                        id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._6 ? 6 :
                            id === const_settings_1["default"].ACTIVITY_TIME.EMOJI._7 ? 7 :
                                null;
};
var changeValueOfSheet = function (value, day, section, user) { return __awaiter(void 0, void 0, void 0, function () {
    var col1, col2, count, sheet, users, row, _a, _b, i, cell, e_1_1;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                col1 = day !== 1 ? alphabet_to_number_1.AtoA('A', day - 2) : '';
                col2 = const_settings_1["default"].ACTIVITY_TIME_SHEET.SEPARATE[section - 1];
                count = const_settings_1["default"].ACTIVITY_TIME_SHEET.NUMBER[section - 1];
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].ACTIVITY_TIME_SHEET.SHEET_NAME)];
            case 1:
                sheet = _d.sent();
                return [4, status.FetchUserFromSheet(sheet)];
            case 2:
                users = _d.sent();
                row = users.map(function (u) { return u.id; }).indexOf(user.id) + 3;
                if (row === 2)
                    return [2];
                _d.label = 3;
            case 3:
                _d.trys.push([3, 10, 11, 12]);
                _a = __values(Array(count)
                    .fill('')
                    .map(function (_, i) { return i; })), _b = _a.next();
                _d.label = 4;
            case 4:
                if (!!_b.done) return [3, 9];
                i = _b.value;
                return [4, sheet.getCell("" + col1 + alphabet_to_number_1.AtoA(col2, i) + row)];
            case 5:
                cell = _d.sent();
                return [4, cell.setValue(value)];
            case 6:
                _d.sent();
                return [4, util.Sleep(0)];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _b = _a.next();
                return [3, 4];
            case 9: return [3, 12];
            case 10:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3, 12];
            case 11:
                try {
                    if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 12: return [2];
        }
    });
}); };
exports.Switch = function (day, section) { return __awaiter(void 0, void 0, void 0, function () {
    var col1, col2, sheet, users, users_1, users_1_1, u, guildMember, row, cell, e_2_1;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                col1 = day !== 1 ? alphabet_to_number_1.AtoA('A', day - 2) : '';
                col2 = const_settings_1["default"].ACTIVITY_TIME_SHEET.SEPARATE[section - 1];
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].ACTIVITY_TIME_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                return [4, status.FetchUserFromSheet(sheet)];
            case 2:
                users = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 10, 11, 12]);
                users_1 = __values(users), users_1_1 = users_1.next();
                _b.label = 4;
            case 4:
                if (!!users_1_1.done) return [3, 9];
                u = users_1_1.value;
                return [4, util.MemberFromId(u.id)];
            case 5:
                guildMember = _b.sent();
                row = users.map(function (u) { return u.id; }).indexOf(u.id) + 3;
                return [4, sheet.getCell("" + col1 + col2 + row)];
            case 6:
                cell = _b.sent();
                return [4, cell.getValue()];
            case 7:
                if (_b.sent()) {
                    guildMember.roles.add(const_settings_1["default"].ROLE_ID.AWAY_IN);
                }
                else {
                    guildMember.roles.remove(const_settings_1["default"].ROLE_ID.AWAY_IN);
                }
                _b.label = 8;
            case 8:
                users_1_1 = users_1.next();
                return [3, 4];
            case 9: return [3, 12];
            case 10:
                e_2_1 = _b.sent();
                e_2 = { error: e_2_1 };
                return [3, 12];
            case 11:
                try {
                    if (users_1_1 && !users_1_1.done && (_a = users_1["return"])) _a.call(users_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7];
            case 12: return [2];
        }
    });
}); };
