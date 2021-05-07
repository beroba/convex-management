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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.UpdateSisters = exports.UpdateMembers = exports.RemoveRole = exports.AddTaskKillRoll = exports.SimultConvexCalc = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var alphabet_to_number_1 = require("alphabet-to-number");
var status = __importStar(require("../../io/status"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var util = __importStar(require("../../util"));
var SimultConvexCalc = function (HP, A, B, msg) {
    var a = overCalc(HP, A, B);
    var b = overCalc(HP, B, A);
    msg.reply("```A " + a + "s\nB " + b + "s```\u30C0\u30E1\u30FC\u30B8\u306E\u9AD8\u3044\u65B9\u3092\u5148\u306B\u901A\u3057\u305F\u65B9\u304C\u6301\u3061\u8D8A\u3057\u6642\u9593\u304C\u9577\u304F\u306A\u308B\u308F\u3088\uFF01");
};
exports.SimultConvexCalc = SimultConvexCalc;
var overCalc = function (HP, a, b) {
    return Math.ceil(90 - (((HP - a) * 90) / b - 20));
};
var AddTaskKillRoll = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var isRole;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                isRole = util.IsRole(msg.member, const_settings_1["default"].ROLE_ID.TASK_KILL);
                if (!isRole) return [3, 1];
                msg.reply('既にタスキルしてるわ');
                return [3, 3];
            case 1: return [4, ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.add(const_settings_1["default"].ROLE_ID.TASK_KILL))];
            case 2:
                _b.sent();
                msg.reply('タスキルロールを付けたわよ！');
                _b.label = 3;
            case 3: return [2];
        }
    });
}); };
exports.AddTaskKillRoll = AddTaskKillRoll;
var RemoveRole = function () { return __awaiter(void 0, void 0, void 0, function () {
    var clanMembers;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                clanMembers = (_c = (_b = (_a = util
                    .GetGuild()) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return m; })) !== null && _c !== void 0 ? _c : [];
                return [4, Promise.all(clanMembers.map(function (m) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, (m === null || m === void 0 ? void 0 : m.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX))];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); }))];
            case 1:
                _d.sent();
                return [2];
        }
    });
}); };
exports.RemoveRole = RemoveRole;
var UpdateMembers = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [2];
        }
    });
}); };
exports.UpdateMembers = UpdateMembers;
var UpdateSisters = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [2];
        }
    });
}); };
exports.UpdateSisters = UpdateSisters;
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
