"use strict";
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
exports.GetTextChannel = exports.GetMembersFromUser = exports.GetUserName = exports.MemberFromId = exports.IsRole = exports.IsChannel = exports.GetCalInfo = exports.GetGuild = exports.Omit = exports.Sleep = exports.Format = void 0;
var moji_1 = __importDefault(require("moji"));
var throw_env_1 = __importDefault(require("throw-env"));
var const_settings_1 = __importDefault(require("const-settings"));
var index_1 = require("../index");
var Format = function (str) {
    return moji_1["default"](str)
        .convert('ZE', 'HE')
        .convert('ZS', 'HS')
        .toString()
        .replace(/[^\S\n\r]+/g, ' ');
};
exports.Format = Format;
var Sleep = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
exports.Sleep = Sleep;
var Omit = function (v) { return !/^,+$/.test(v.toString()); };
exports.Omit = Omit;
var GetGuild = function () { return index_1.Client.guilds.cache.get(throw_env_1["default"]('CLAN_SERVER_ID')); };
exports.GetGuild = GetGuild;
var GetCalInfo = function () { var _a; return (_a = exports.GetGuild()) === null || _a === void 0 ? void 0 : _a.members.cache.get(const_settings_1["default"].CAL_ID); };
exports.GetCalInfo = GetCalInfo;
var IsChannel = function (array, channel) {
    return array.some(function (c) { return c === channel.name; });
};
exports.IsChannel = IsChannel;
var IsRole = function (member, role) {
    return member === null || member === void 0 ? void 0 : member.roles.cache.some(function (r) { return r.id === role; });
};
exports.IsRole = IsRole;
var MemberFromId = function (id) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0: return [4, ((_a = exports.GetGuild()) === null || _a === void 0 ? void 0 : _a.members.fetch())];
        case 1: return [2, (_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.map(function (m) { return m; }).find(function (m) { return m.id === id; })];
    }
}); }); };
exports.MemberFromId = MemberFromId;
var GetUserName = function (m) { var _a; return (m === null || m === void 0 ? void 0 : m.nickname) ? m === null || m === void 0 ? void 0 : m.nickname : (_a = m === null || m === void 0 ? void 0 : m.user.username) !== null && _a !== void 0 ? _a : ''; };
exports.GetUserName = GetUserName;
var GetMembersFromUser = function (member, user) {
    return member === null || member === void 0 ? void 0 : member.cache.map(function (m) { return m; }).find(function (m) { return m.user.id === user.id; });
};
exports.GetMembersFromUser = GetMembersFromUser;
var GetTextChannel = function (id) { return index_1.Client.channels.cache.get(id); };
exports.GetTextChannel = GetTextChannel;
