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
exports.Management = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var alphabet_to_number_1 = require("alphabet-to-number");
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var bossTable = __importStar(require("../../io/bossTable"));
var dateTable = __importStar(require("../../io/dateTable"));
var status = __importStar(require("../../io/status"));
var category = __importStar(require("./category"));
var activityTime = __importStar(require("../convex/activityTime"));
var situation = __importStar(require("../convex/situation"));
exports.Management = function (command, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var isRole, _a, members, arg, arg, arg;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.MANAGEMENT, msg.channel))
                    return [2];
                isRole = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.cache.some(function (r) { return const_settings_1["default"].COMMAND_ROLE.some(function (v) { return v === r.id; }); });
                if (!isRole)
                    return [2];
                _a = true;
                switch (_a) {
                    case /cb manage reflect/.test(command): return [3, 1];
                    case /cb manage create category/.test(command): return [3, 7];
                    case /cb manage delete category/.test(command): return [3, 8];
                    case /cb manage set days/.test(command): return [3, 9];
                    case /cb manage set boss/.test(command): return [3, 11];
                    case /cb manage remove role/.test(command): return [3, 13];
                    case /cb manage update members/.test(command): return [3, 14];
                    case /cb manage update sisters/.test(command): return [3, 15];
                    case /cb manage set react/.test(command): return [3, 16];
                    case /cb manage reflect activity time/.test(command): return [3, 19];
                    case /cb manage sheet/.test(command): return [3, 21];
                }
                return [3, 22];
            case 1: return [4, current.ReflectOnCal()];
            case 2:
                _c.sent();
                return [4, util.Sleep(100)];
            case 3:
                _c.sent();
                return [4, status.ReflectOnCal()];
            case 4:
                _c.sent();
                return [4, util.Sleep(100)];
            case 5:
                _c.sent();
                return [4, status.Fetch()];
            case 6:
                members = _c.sent();
                situation.Report(members);
                msg.reply('スプレッドシートの値をキャルに反映させたわよ！');
                return [2, 'Reflect spreadsheet values ​​in Cal'];
            case 7:
                {
                    arg = command.replace('/cb manage create category', '');
                    category.Create(arg, msg);
                    return [2, 'Create ClanBattle category'];
                }
                _c.label = 8;
            case 8:
                {
                    arg = command.replace('/cb manage delete category', '');
                    category.Delete(arg, msg);
                    return [2, 'Delete ClanBattle category'];
                }
                _c.label = 9;
            case 9:
                arg = command.replace('/cb manage set days ', '');
                return [4, dateTable.Update(arg)];
            case 10:
                _c.sent();
                msg.reply('クランバトルの日付を設定したわよ！');
                return [2, 'Set convex days'];
            case 11: return [4, bossTable.Update()];
            case 12:
                _c.sent();
                msg.reply('クランバトルのボステーブルを設定したわよ！');
                return [2, 'Set convex bossTable'];
            case 13:
                {
                    removeRole(msg);
                    return [2, 'Release all remaining convex rolls'];
                }
                _c.label = 14;
            case 14:
                {
                    updateMembers(msg);
                    return [2, 'Update convex management members'];
                }
                _c.label = 15;
            case 15:
                {
                    updateSisters(msg);
                    return [2, 'Update convex management sisters'];
                }
                _c.label = 16;
            case 16: return [4, setReactForDeclare()];
            case 17:
                _c.sent();
                return [4, setReactForActivityTime()];
            case 18:
                _c.sent();
                msg.reply('凸管理用の絵文字を設定したわよ！');
                return [2, 'Set react for convex'];
            case 19: return [4, activityTime.ReflectOnSheet()];
            case 20:
                _c.sent();
                return [2, 'Reflect activity time on the sheet'];
            case 21:
                {
                    msg.reply(const_settings_1["default"].URL.SPREADSHEET);
                    return [2, 'Show spreadsheet link'];
                }
                _c.label = 22;
            case 22: return [2];
        }
    });
}); };
var removeRole = function (msg) {
    var _a, _b;
    var clanMembers = (_b = (_a = util
        .GetGuild()) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return m; });
    clanMembers === null || clanMembers === void 0 ? void 0 : clanMembers.forEach(function (m) { return m === null || m === void 0 ? void 0 : m.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX); });
    msg.reply('凸残ロール全て外したわよ！');
};
var updateMembers = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                users = (_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return ({
                    name: util.GetUserName(m),
                    id: m.id,
                    limit: ''
                }); }).sort(function (a, b) { return (a.name > b.name ? 1 : -1); });
                return [4, status.UpdateUsers(users)];
            case 1:
                _c.sent();
                return [4, util.Sleep(100)];
            case 2:
                _c.sent();
                return [4, fetchNameAndID(users, const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 3:
                _c.sent();
                msg.reply('クランメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var updateSisters = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                users = (_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.SISTER_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return ({
                    name: util.GetUserName(m),
                    id: m.id,
                    limit: ''
                }); }).sort(function (a, b) { return (a.name > b.name ? 1 : -1); });
                return [4, fetchNameAndID(users, const_settings_1["default"].SISTER_SHEET.SHEET_NAME)];
            case 1:
                _c.sent();
                msg.reply('妹クランメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var fetchNameAndID = function (users, name) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!users)
                    return [2];
                return [4, spreadsheet.GetWorksheet(name)];
            case 1:
                sheet = _a.sent();
                return [4, Promise.all(users.map(function (m, i) { return __awaiter(void 0, void 0, void 0, function () {
                        var col, name_cell, id_cell;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    col = const_settings_1["default"].INFORMATION_SHEET.MEMBER_COLUMN;
                                    return [4, sheet.getCell("" + col + (i + 3))];
                                case 1:
                                    name_cell = _a.sent();
                                    name_cell.setValue(m.name);
                                    return [4, sheet.getCell("" + alphabet_to_number_1.AtoA(col, 1) + (i + 3))];
                                case 2:
                                    id_cell = _a.sent();
                                    id_cell.setValue(m.id);
                                    return [2];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
var setReactForDeclare = function () { return __awaiter(void 0, void 0, void 0, function () {
    var channel, declare;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_DECLARE_ID.DECLARE)];
            case 1:
                declare = _a.sent();
                return [4, declare.react(const_settings_1["default"].EMOJI_ID.TOTU)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
var setReactForActivityTime = function () { return __awaiter(void 0, void 0, void 0, function () {
    var channel, awayIn, days, first, latter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME);
                return [4, channel.messages.fetch(const_settings_1["default"].ACTIVITY_TIME.AWAY_IN)];
            case 1:
                awayIn = _a.sent();
                return [4, awayIn.react(const_settings_1["default"].EMOJI_ID.SHUSEKI)];
            case 2:
                _a.sent();
                return [4, awayIn.react(const_settings_1["default"].EMOJI_ID.RISEKI)];
            case 3:
                _a.sent();
                days = Object.values(const_settings_1["default"].ACTIVITY_TIME.DAYS);
                Promise.all(days.map(function (id) { return __awaiter(void 0, void 0, void 0, function () {
                    var day, emoji;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, channel.messages.fetch(id)];
                            case 1:
                                day = _a.sent();
                                emoji = Object.values(const_settings_1["default"].ACTIVITY_TIME.EMOJI);
                                Promise.all(emoji.map(function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2, day.react(id)];
                                }); }); }));
                                return [2];
                        }
                    });
                }); }));
                return [4, channel.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.FIRST)];
            case 4:
                first = _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._5)];
            case 5:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._6)];
            case 6:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._7)];
            case 7:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._8)];
            case 8:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._9)];
            case 9:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._10)];
            case 10:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._11)];
            case 11:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._12)];
            case 12:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._13)];
            case 13:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._14)];
            case 14:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._15)];
            case 15:
                _a.sent();
                return [4, first.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._16)];
            case 16:
                _a.sent();
                return [4, channel.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.LATTER)];
            case 17:
                latter = _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._17)];
            case 18:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._18)];
            case 19:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._19)];
            case 20:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._20)];
            case 21:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._21)];
            case 22:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._22)];
            case 23:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._23)];
            case 24:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._0)];
            case 25:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._1)];
            case 26:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._2)];
            case 27:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._3)];
            case 28:
                _a.sent();
                return [4, latter.react(const_settings_1["default"].TIME_LIMIT_EMOJI.EMOJI._4)];
            case 29:
                _a.sent();
                return [2];
        }
    });
}); };
