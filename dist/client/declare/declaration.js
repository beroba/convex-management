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
exports.ResetReact = exports.SetUser = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var schedule = __importStar(require("../../io/schedule"));
var status = __importStar(require("../../io/status"));
exports.SetUser = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, declare, emoji, plans, honsen, hoken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_DECLARE_ID.DECLARE)];
            case 1:
                declare = _a.sent();
                return [4, Promise.all(declare.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, r.users.fetch()];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); }))];
            case 2:
                _a.sent();
                emoji = declare.reactions.cache.map(function (r) { return ({ name: r.emoji.name, users: r.users.cache.map(function (u) { return u; }) }); });
                return [4, schedule.FetchBoss(state.alpha)];
            case 3:
                plans = _a.sent();
                return [4, createDeclareList(plans, emoji, 'honsen')];
            case 4:
                honsen = _a.sent();
                return [4, createDeclareList(plans, emoji, 'hoken')];
            case 5:
                hoken = _a.sent();
                declare.edit('凸宣言 `[現在の凸数(+は持越), 活動限界時間]`\n' +
                    '```' +
                    ("\n\u2015\u2015\u2015\u2015\u672C\u6226\u2015\u2015\u2015\u2015\n" + honsen.join('\n') + (honsen.length ? '\n' : '') + "\n\u2015\u2015\u2015\u2015\u4FDD\u967A\u2015\u2015\u2015\u2015\n" + hoken.join('\n')) +
                    '```');
                return [2];
        }
    });
}); };
var createDeclareList = function (plans, emoji, name) { return __awaiter(void 0, void 0, void 0, function () {
    var convex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Promise.all(emoji.filter(function (e) { return e.name === name; })[0]
                    .users
                    .map(function (u) { return status.FetchMember(u.id); }))];
            case 1:
                convex = (_a.sent()).filter(function (m) { return m; });
                return [2, convex.map(function (m) {
                        var p = plans.find(function (p) { return p.playerID === (m === null || m === void 0 ? void 0 : m.id); });
                        return (m === null || m === void 0 ? void 0 : m.name) + "[" + ((m === null || m === void 0 ? void 0 : m.convex) ? m === null || m === void 0 ? void 0 : m.convex : '0') + ((m === null || m === void 0 ? void 0 : m.over) ? '+' : '') + "]" + (p ? " " + p.msg : '');
                    })];
        }
    });
}); };
exports.ResetReact = function () { return __awaiter(void 0, void 0, void 0, function () {
    var channel, declare;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_DECLARE_ID.DECLARE)];
            case 1:
                declare = _a.sent();
                return [4, declare.reactions.removeAll()];
            case 2:
                _a.sent();
                return [4, declare.react(const_settings_1["default"].EMOJI_ID.HONSEN)];
            case 3:
                _a.sent();
                return [4, declare.react(const_settings_1["default"].EMOJI_ID.HOKEN)];
            case 4:
                _a.sent();
                return [2];
        }
    });
}); };