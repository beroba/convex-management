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
exports.Management = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
exports.Management = function (command, msg) {
    if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.MANAGEMENT, msg.channel))
        return;
    switch (true) {
        case /cb manage create category/.test(command):
            var arg = command.replace('/cb manage create category', '');
            createCategory(msg, arg);
            return 'Create ClanBattle category';
        case /cb manage update members/.test(command):
            updateMembers(msg);
            return 'Update convex management members';
        case /cb manage sheet/.test(command):
            spreadsheetLink(msg);
            return 'Show spreadsheet link';
    }
};
var createCategory = function (msg, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var clanMembers, permission, _a, year, day, channel;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                clanMembers = (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS);
                if (!clanMembers)
                    return [2];
                permission = [
                    {
                        id: ((_c = msg.guild) === null || _c === void 0 ? void 0 : _c.roles.everyone.id) || '',
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: clanMembers.id,
                        allow: ['VIEW_CHANNEL']
                    },
                ];
                _a = __read(arg ? arg.split('/').map(Number) : (function (d) { return [d.getFullYear(), d.getMonth() + 1]; })(new Date()), 2), year = _a[0], day = _a[1];
                return [4, ((_d = msg.guild) === null || _d === void 0 ? void 0 : _d.channels.create(year + "\u5E74" + day + "\u6708\u30AF\u30E9\u30D0\u30C8", {
                        type: 'category',
                        position: 4,
                        permissionOverwrites: permission
                    }))];
            case 1:
                channel = _e.sent();
                return [4, channelNameList()];
            case 2:
                (_e.sent()).forEach(function (name) { return __awaiter(void 0, void 0, void 0, function () {
                    var c;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4, ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.create(name, { type: 'text', parent: channel === null || channel === void 0 ? void 0 : channel.id }))];
                            case 1:
                                c = _b.sent();
                                c === null || c === void 0 ? void 0 : c.send(name);
                                return [2];
                        }
                    });
                }); });
                return [2];
        }
    });
}); };
var channelNameList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var infoSheet, cells, _a, _b, a, _c, b, _d, c, _e, d, _f, e;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].CONVEX_SHEET.INFORMATION)];
            case 1:
                infoSheet = _g.sent();
                return [4, spreadsheet.GetCells(infoSheet, const_settings_1["default"].INFORMATION_CELLS.BOSS)];
            case 2:
                cells = _g.sent();
                _a = __read(util.PiecesEach(cells, 2).map(function (v) { return v[1]; }), 5), _b = _a[0], a = _b === void 0 ? 'a' : _b, _c = _a[1], b = _c === void 0 ? 'b' : _c, _d = _a[2], c = _d === void 0 ? 'c' : _d, _e = _a[3], d = _e === void 0 ? 'd' : _e, _f = _a[4], e = _f === void 0 ? 'e' : _f;
                return [2, [
                        '検証総合', '凸ルート相談', '編成相談',
                        a + "\u6A21\u64EC",
                        'ⓐtl',
                        b + "\u6A21\u64EC",
                        'ⓑtl',
                        c + "\u6A21\u64EC",
                        'ⓒtl',
                        d + "\u6A21\u64EC",
                        'ⓓtl',
                        e + "\u6A21\u64EC",
                        'ⓔtl',
                    ]];
        }
    });
}); };
var updateMembers = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var clanMembers, manageSheet;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                clanMembers = (_b = (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(const_settings_1["default"].ROLE_ID.CLAN_MEMBERS)) === null || _b === void 0 ? void 0 : _b.members.map(function (m) { return (m.nickname ? m.nickname : m.user.username); }).sort();
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].CONVEX_SHEET.MANAGEMENT)];
            case 1:
                manageSheet = _c.sent();
                clanMembers === null || clanMembers === void 0 ? void 0 : clanMembers.forEach(function (m, i) { return __awaiter(void 0, void 0, void 0, function () {
                    var cell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, manageSheet.getCell("A" + (i + 2))];
                            case 1:
                                cell = _a.sent();
                                return [4, cell.setValue(m)];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                msg.reply('凸管理のメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var spreadsheetLink = function (msg) {
    msg.reply('https://docs.google.com/spreadsheets/d/11uWCeVC5kWKYAWVJrHRoYz502Wue6qHyDtbNM4UULso');
};