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
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var category = __importStar(require("./category"));
exports.Management = function (command, msg) {
    var _a;
    if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.MANAGEMENT, msg.channel))
        return;
    var isRole = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.cache.some(function (r) { return const_settings_1["default"].COMMAND_ROLE.some(function (v) { return v === r.id; }); });
    if (!isRole)
        return;
    switch (true) {
        case /cb manage create category/.test(command): {
            var arg = command.replace('/cb manage create category', '');
            category.Create(arg, msg);
            return 'Create ClanBattle category';
        }
        case /cb manage delete category/.test(command): {
            var arg = command.replace('/cb manage delete category', '');
            category.Delete(arg, msg);
            return 'Delete ClanBattle category';
        }
        case /cb manage set days/.test(command): {
            var arg = command.replace('/cb manage set days ', '');
            setDate(arg, msg);
            return 'Update convex management members';
        }
        case /cb manage remove role/.test(command): {
            removeRole(msg);
            return 'Release all remaining convex rolls';
        }
        case /cb manage update members/.test(command): {
            updateMembers(msg);
            return 'Update convex management members';
        }
        case /cb manage update sisters/.test(command): {
            updateSisters(msg);
            return 'Update convex management sisters';
        }
        case /cb manage sheet/.test(command): {
            spreadsheetLink(msg);
            return 'Show spreadsheet link';
        }
        case /cb test/.test(command): {
            category.SetSeparate(3);
            return 'test';
        }
    }
};
var setDate = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var days, infoSheet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                days = Array.from(Array(5), function (_, i) { return arg.split('/')[0] + "/" + (Number(arg.split('/')[1]) + i); });
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                infoSheet = _a.sent();
                days.forEach(function (d, i) { return __awaiter(void 0, void 0, void 0, function () {
                    var cell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, infoSheet.getCell("" + const_settings_1["default"].INFORMATION_SHEET.DATE_COLUMN + (i + 3))];
                            case 1:
                                cell = _a.sent();
                                return [4, cell.setValue(d)];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                msg.reply('クランバトルの日付を設定したわよ！');
                return [2];
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
    var members, sheet;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                members = (_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return ({
                    name: util.GetUserName(m),
                    id: m.id
                }); }).sort(function (a, b) { return (a.name > b.name ? 1 : -1); });
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _c.sent();
                fetchNameAndId(members, sheet);
                msg.reply('クランメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var updateSisters = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var members, sheet;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                members = (_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.SISTER_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return ({
                    name: util.GetUserName(m),
                    id: m.id
                }); }).sort(function (a, b) { return (a.name > b.name ? 1 : -1); });
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].SISTER_SHEET.SHEET_NAME)];
            case 1:
                sheet = _c.sent();
                fetchNameAndId(members, sheet);
                msg.reply('妹クランメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var fetchNameAndId = function (members, sheet) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        members === null || members === void 0 ? void 0 : members.forEach(function (m, i) { return __awaiter(void 0, void 0, void 0, function () {
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
        }); });
        return [2];
    });
}); };
var spreadsheetLink = function (msg) {
    msg.reply(const_settings_1["default"].URL.SPREADSHEET);
};
