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
exports.CheckTheStage = exports.Delete = exports.Create = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var bossTable = __importStar(require("../../io/bossTable"));
exports.Create = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, day, channel, names, list, sheet;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = __read(arg ? arg.split('/').map(Number) : (function (d) { return [d.getFullYear(), d.getMonth() + 1]; })(new Date()), 2), year = _a[0], day = _a[1];
                return [4, ((_b = msg.guild) === null || _b === void 0 ? void 0 : _b.channels.create(year + "\u5E74" + day + "\u6708\u30AF\u30E9\u30D0\u30C8", {
                        type: 'category',
                        position: const_settings_1["default"].CATEGORY.POSITION,
                        permissionOverwrites: settingPermissions(msg)
                    }))];
            case 1:
                channel = _c.sent();
                return [4, createChannelInfo()];
            case 2:
                names = _c.sent();
                return [4, Promise.all(names.map(function (info) { return __awaiter(void 0, void 0, void 0, function () {
                        var c;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4, ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.create(info.name, { type: 'text', parent: channel === null || channel === void 0 ? void 0 : channel.id }))];
                                case 1:
                                    c = _b.sent();
                                    c === null || c === void 0 ? void 0 : c.send(info.row ? separate(1) : info.name);
                                    return [2, { name: info.name, row: info.row, id: c === null || c === void 0 ? void 0 : c.id }];
                            }
                        });
                    }); }))];
            case 3:
                list = _c.sent();
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 4:
                sheet = _c.sent();
                fetchChannelID(list, sheet);
                resetStageFlag(sheet);
                msg.reply(year + "\u5E74" + day + "\u6708\u306E\u30AB\u30C6\u30B4\u30EA\u30FC\u3092\u4F5C\u6210\u3057\u305F\u308F\u3088\uFF01");
                return [2];
        }
    });
}); };
exports.Delete = function (arg, msg) {
    var _a;
    var _b = __read(arg.split('/').map(Number), 2), year = _b[0], day = _b[1];
    if (!year)
        return msg.reply('ちゃんと年と月を入力しなさい');
    var category = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find(function (c) { return c.name === year + "\u5E74" + day + "\u6708\u30AF\u30E9\u30D0\u30C8"; });
    if (!category)
        return msg.reply(year + "\u5E74" + day + "\u6708\u30AF\u30E9\u30D0\u30C8\u306A\u3093\u3066\u306A\u3044\u3093\u3060\u3051\u3069\uFF01");
    var channels = category.guild.channels.cache.filter(function (c) { return c.parentID === category.id; });
    category === null || category === void 0 ? void 0 : category["delete"]();
    channels === null || channels === void 0 ? void 0 : channels.forEach(function (c) { return setTimeout(function () { return c["delete"](); }, 1000); });
    msg.reply(year + "\u5E74" + day + "\u6708\u306E\u30AB\u30C6\u30B4\u30EA\u30FC\u3092\u524A\u9664\u3057\u305F\u308F");
};
exports.CheckTheStage = function (n) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, stage, _a, category, col, cell;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                _a = pieces_each_1["default"];
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].INFORMATION_SHEET.STAGE_CELLS)];
            case 2:
                stage = _a.apply(void 0, [_b.sent(), 2]);
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].INFORMATION_SHEET.CATEGORY_CELLS)];
            case 3:
                category = _b.sent();
                if (stage[n - 1][1])
                    return [2];
                pieces_each_1["default"](category, 2)
                    .filter(util.Omit)
                    .forEach(function (c) {
                    var channel = util.GetTextChannel(c[1]);
                    channel.send(separate(n));
                });
                col = const_settings_1["default"].INFORMATION_SHEET.STAGE_COLUMN;
                return [4, sheet.getCell("" + col + (n + 2))];
            case 4:
                cell = _b.sent();
                cell.setValue(1);
                return [2];
        }
    });
}); };
var separate = function (n) { return "\u30FC\u30FC\u30FC\u30FC\u30FC\u30FC\u30FC\u30FC" + n + "\u6BB5\u968E\u76EE\u30FC\u30FC\u30FC\u30FC\u30FC\u30FC\u30FC\u30FC"; };
var settingPermissions = function (msg) {
    var _a, _b, _c, _d, _e, _f;
    var leader = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.LEADER);
    if (!leader)
        return [];
    var subLeader = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.get(const_settings_1["default"].ROLE_ID.SUB_LEADER);
    if (!subLeader)
        return [];
    var clanMembers = (_c = msg.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS);
    if (!clanMembers)
        return [];
    var sisterMembers = (_d = msg.guild) === null || _d === void 0 ? void 0 : _d.roles.cache.get(const_settings_1["default"].ROLE_ID.SISTER_MEMBERS);
    if (!sisterMembers)
        return [];
    var tomodachi = (_e = msg.guild) === null || _e === void 0 ? void 0 : _e.roles.cache.get(const_settings_1["default"].ROLE_ID.TOMODACHI);
    if (!tomodachi)
        return [];
    var everyone = (_f = msg.guild) === null || _f === void 0 ? void 0 : _f.roles.everyone;
    if (!everyone)
        return [];
    return [
        { id: leader.id, allow: ['MENTION_EVERYONE'] },
        { id: subLeader.id, allow: ['MANAGE_MESSAGES'] },
        { id: clanMembers.id, allow: ['VIEW_CHANNEL'] },
        { id: sisterMembers.id, allow: ['VIEW_CHANNEL'] },
        { id: tomodachi.id, allow: ['VIEW_CHANNEL'] },
        { id: everyone.id, deny: ['VIEW_CHANNEL', 'MENTION_EVERYONE'] },
    ];
};
var createChannelInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var month, table, _a, a, b, c, d, e;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                month = new Date().getMonth() + 1 + "\u6708";
                return [4, bossTable.Fetch()];
            case 1:
                table = _b.sent();
                _a = __read(table.map(function (t) { return t.name; }), 5), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
                return [2, [
                        { name: month + "-\u51F8\u30EB\u30FC\u30C8\u6848", row: 0, id: '' },
                        { name: month + "-\u691C\u8A3C\u7DCF\u5408", row: 0, id: '' },
                        { name: "" + a, row: 3, id: '' },
                        { name: a + "-\u30AA\u30FC\u30C8", row: 4, id: '' },
                        { name: "" + b, row: 5, id: '' },
                        { name: b + "-\u30AA\u30FC\u30C8", row: 6, id: '' },
                        { name: "" + c, row: 7, id: '' },
                        { name: c + "-\u30AA\u30FC\u30C8", row: 8, id: '' },
                        { name: "" + d, row: 9, id: '' },
                        { name: d + "-\u30AA\u30FC\u30C8", row: 10, id: '' },
                        { name: "" + e, row: 11, id: '' },
                        { name: e + "-\u30AA\u30FC\u30C8", row: 12, id: '' },
                        { name: '持ち越し編成', row: 0, id: '' },
                    ]];
        }
    });
}); };
var fetchChannelID = function (list, sheet) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        list.forEach(function (c) { return __awaiter(void 0, void 0, void 0, function () {
            var col, row, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        col = const_settings_1["default"].INFORMATION_SHEET.CATEGORY_COLUMN;
                        row = c.row;
                        if (!row)
                            return [2];
                        return [4, sheet.getCell("" + col + row)];
                    case 1:
                        cell = _a.sent();
                        cell.setValue(c.id);
                        return [2];
                }
            });
        }); });
        return [2];
    });
}); };
var resetStageFlag = function (sheet) { return __awaiter(void 0, void 0, void 0, function () {
    var col;
    return __generator(this, function (_a) {
        col = const_settings_1["default"].INFORMATION_SHEET.STAGE_COLUMN;
        [2, 3, 4, 5].forEach(function (n) { return __awaiter(void 0, void 0, void 0, function () {
            var cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, sheet.getCell("" + col + (n + 2))];
                    case 1:
                        cell = _a.sent();
                        cell.setValue('');
                        return [2];
                }
            });
        }); });
        return [2];
    });
}); };
