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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.Switch = exports.ReflectOnSheet = exports.Remove = exports.Add = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var alphabet_to_number_1 = require("alphabet-to-number");
var status = __importStar(require("../../io/status"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var Add = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
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
                changeValueOfSheet('1', day, section, user.id);
                return [4, util.Sleep(100)];
            case 2:
                _a.sent();
                return [2, 'Activity time questionnaire add'];
        }
    });
}); };
exports.Add = Add;
var Remove = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
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
                changeValueOfSheet('', day, section, user.id);
                return [4, util.Sleep(100)];
            case 2:
                _a.sent();
                return [2, 'Activity time questionnaire remove'];
        }
    });
}); };
exports.Remove = Remove;
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
var changeValueOfSheet = function (value, day, section, id) { return __awaiter(void 0, void 0, void 0, function () {
    var col1, col2, sheet, users, row, cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                col1 = day !== 1 ? alphabet_to_number_1.AtoA('A', day - 2) : '';
                col2 = const_settings_1["default"].ACTIVITY_TIME_SHEET.SEPARATE[section - 1];
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].ACTIVITY_TIME_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, status.FetchUserFromSheet(sheet)];
            case 2:
                users = _a.sent();
                row = users.map(function (u) { return u.id; }).indexOf(id) + 3;
                if (row === 2)
                    return [2];
                return [4, sheet.getCell("" + col1 + col2 + row)];
            case 3:
                cell = _a.sent();
                return [4, cell.setValue(value)];
            case 4:
                _a.sent();
                return [2];
        }
    });
}); };
var changeValueOfSheetUsers = function (value, day, section, idList, sheet, users) { return __awaiter(void 0, void 0, void 0, function () {
    var idList_1, idList_1_1, id, col1, col2, row, cell, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, 8, 9]);
                idList_1 = __values(idList), idList_1_1 = idList_1.next();
                _b.label = 1;
            case 1:
                if (!!idList_1_1.done) return [3, 6];
                id = idList_1_1.value;
                col1 = day !== 1 ? alphabet_to_number_1.AtoA('A', day - 2) : '';
                col2 = const_settings_1["default"].ACTIVITY_TIME_SHEET.SEPARATE[section - 1];
                row = users.map(function (u) { return u.id; }).indexOf(id) + 3;
                if (row === 2)
                    return [3, 5];
                return [4, sheet.getCell("" + col1 + col2 + row)];
            case 2:
                cell = _b.sent();
                return [4, cell.setValue(value)];
            case 3:
                _b.sent();
                console.log(id);
                return [4, util.Sleep(100)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                idList_1_1 = idList_1.next();
                return [3, 1];
            case 6: return [3, 9];
            case 7:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 9];
            case 8:
                try {
                    if (idList_1_1 && !idList_1_1.done && (_a = idList_1["return"])) _a.call(idList_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 9: return [2];
        }
    });
}); };
var ReflectOnSheet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var channel, sheet, users, _a, _b, day, msg, list, _loop_1, list_1, list_1_1, l, state_1, e_2_1, e_3_1;
    var e_3, _c, e_2, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME);
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].ACTIVITY_TIME_SHEET.SHEET_NAME)];
            case 1:
                sheet = _e.sent();
                return [4, status.FetchUserFromSheet(sheet)];
            case 2:
                users = _e.sent();
                _e.label = 3;
            case 3:
                _e.trys.push([3, 17, 18, 19]);
                _a = __values(Object.values(const_settings_1["default"].ACTIVITY_TIME.DAYS)), _b = _a.next();
                _e.label = 4;
            case 4:
                if (!!_b.done) return [3, 16];
                day = _b.value;
                return [4, channel.messages.fetch(day)];
            case 5:
                msg = _e.sent();
                return [4, Promise.all(msg.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, r.users.fetch()];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); }))];
            case 6:
                _e.sent();
                return [4, Promise.all(msg.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2, ({
                                    id: r.emoji.id,
                                    users: r.users.cache.map(function (u) { return u; })
                                })];
                        });
                    }); }))];
            case 7:
                list = _e.sent();
                _loop_1 = function (l) {
                    var checkIdList, noCheckIdList, d, s;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                checkIdList = l.users.filter(function (u) { return !u.bot; }).map(function (u) { return u.id; });
                                noCheckIdList = users.map(function (u) { return u.id; }).filter(function (u) { return !checkIdList.some(function (c) { return c === u; }); });
                                d = confirmDays(day);
                                s = confirmSection(l.id);
                                if (!d)
                                    return [2, { value: void 0 }];
                                if (!s)
                                    return [2, { value: void 0 }];
                                return [4, changeValueOfSheetUsers('1', d, s, checkIdList, sheet, users)];
                            case 1:
                                _f.sent();
                                return [4, changeValueOfSheetUsers('', d, s, noCheckIdList, sheet, users)];
                            case 2:
                                _f.sent();
                                console.log("day: " + d + ", section: " + s);
                                return [2];
                        }
                    });
                };
                _e.label = 8;
            case 8:
                _e.trys.push([8, 13, 14, 15]);
                list_1 = (e_2 = void 0, __values(list)), list_1_1 = list_1.next();
                _e.label = 9;
            case 9:
                if (!!list_1_1.done) return [3, 12];
                l = list_1_1.value;
                return [5, _loop_1(l)];
            case 10:
                state_1 = _e.sent();
                if (typeof state_1 === "object")
                    return [2, state_1.value];
                _e.label = 11;
            case 11:
                list_1_1 = list_1.next();
                return [3, 9];
            case 12: return [3, 15];
            case 13:
                e_2_1 = _e.sent();
                e_2 = { error: e_2_1 };
                return [3, 15];
            case 14:
                try {
                    if (list_1_1 && !list_1_1.done && (_d = list_1["return"])) _d.call(list_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7];
            case 15:
                _b = _a.next();
                return [3, 4];
            case 16: return [3, 19];
            case 17:
                e_3_1 = _e.sent();
                e_3 = { error: e_3_1 };
                return [3, 19];
            case 18:
                try {
                    if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
                return [7];
            case 19: return [2];
        }
    });
}); };
exports.ReflectOnSheet = ReflectOnSheet;
var Switch = function (day, section) { return __awaiter(void 0, void 0, void 0, function () {
    var col1, col2, sheet, users, users_1, users_1_1, u, guildMember, row, cell, e_4_1;
    var e_4, _a;
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
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3, 12];
            case 11:
                try {
                    if (users_1_1 && !users_1_1.done && (_a = users_1["return"])) _a.call(users_1);
                }
                finally { if (e_4) throw e_4.error; }
                return [7];
            case 12: return [2];
        }
    });
}); };
exports.Switch = Switch;
