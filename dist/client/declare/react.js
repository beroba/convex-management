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
exports.NoticeCancel = exports.WaitNotice = exports.OverNotice = exports.ConfirmNotice = exports.ConvexDone = exports.ConvexRemove = exports.ConvexAdd = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var status = __importStar(require("../../io/status"));
var declaration = __importStar(require("./declaration"));
var declare = __importStar(require("./status"));
var ConvexAdd = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member, state;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                if (react.message.id !== const_settings_1["default"].CONVEX_DECLARE_ID.DECLARE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.TOTU) {
                    react.users.remove(user);
                    return [2];
                }
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _c.sent();
                if (!member) {
                    react.users.remove(user);
                    return [2];
                }
                return [4, current.Fetch()];
            case 2:
                state = _c.sent();
                return [4, declaration.SetUser(state)];
            case 3:
                _c.sent();
                (_b = (_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.map(function (m) { return m; }).find(function (m) { return m.id === user.id; })) === null || _b === void 0 ? void 0 : _b.roles.remove(const_settings_1["default"].ROLE_ID.AWAY_IN);
                return [2, 'Addition of convex declaration'];
        }
    });
}); };
exports.ConvexAdd = ConvexAdd;
var ConvexRemove = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                if (react.message.id !== const_settings_1["default"].CONVEX_DECLARE_ID.DECLARE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.TOTU) {
                    react.users.remove(user);
                    return [2];
                }
                return [4, current.Fetch()];
            case 1:
                state = _a.sent();
                return [4, declaration.SetUser(state)];
            case 2:
                _a.sent();
                return [2, 'Deletion of convex declaration'];
        }
    });
}); };
exports.ConvexRemove = ConvexRemove;
var ConvexDone = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, msg, state, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_DECLARE_ID.DECLARE)];
            case 1:
                msg = _c.sent();
                return [4, Promise.all(msg.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, r.users.remove(user)];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); }))];
            case 2:
                _c.sent();
                return [4, current.Fetch()];
            case 3:
                state = _c.sent();
                return [4, declaration.SetUser(state)];
            case 4:
                _c.sent();
                _b = (_a = Promise).all;
                return [4, channel.messages.fetch()];
            case 5: return [4, _b.apply(_a, [(_c.sent())
                        .map(function (m) { return m; })
                        .filter(function (m) { return m.author.id === user.id; })
                        .map(function (m) { return m["delete"](); })])];
            case 6:
                _c.sent();
                declare.Update(state);
                console.log('Completion of convex declaration');
                return [2];
        }
    });
}); };
exports.ConvexDone = ConvexDone;
var ConfirmNotice = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, sumi, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.TOOSHI) {
                    if ([const_settings_1["default"].EMOJI_ID.MOCHIKOSHI, const_settings_1["default"].EMOJI_ID.TAIKI].some(function (id) { return id === react.emoji.id; }))
                        return [2];
                    react.users.remove(user);
                    return [2];
                }
                return [4, fetchMessage(react)];
            case 1:
                msg = _a.sent();
                sumi = msg.reactions.cache.map(function (r) { return r; }).find(function (r) { return r.emoji.id === const_settings_1["default"].EMOJI_ID.SUMI; });
                if (sumi)
                    return [2];
                msg.react(const_settings_1["default"].EMOJI_ID.SUMI);
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send("<@!" + msg.author.id + "> " + msg.content + "\u306E\u78BA\u5B9A\u3092\u304A\u9858\u3044\u3059\u308B\u308F\uFF01");
                return [2, 'Confirm notice'];
        }
    });
}); };
exports.ConfirmNotice = ConfirmNotice;
var OverNotice = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, sumi, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.MOCHIKOSHI) {
                    if ([const_settings_1["default"].EMOJI_ID.TOOSHI, const_settings_1["default"].EMOJI_ID.TAIKI].some(function (id) { return id === react.emoji.id; }))
                        return [2];
                    react.users.remove(user);
                    return [2];
                }
                return [4, fetchMessage(react)];
            case 1:
                msg = _a.sent();
                sumi = msg.reactions.cache.map(function (r) { return r; }).find(function (r) { return r.emoji.id === const_settings_1["default"].EMOJI_ID.SUMI; });
                if (sumi)
                    return [2];
                msg.react(const_settings_1["default"].EMOJI_ID.SUMI);
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send("<@!" + msg.author.id + "> " + msg.content + "\u3067\u6301\u3061\u8D8A\u3057\u304A\u9858\u3044\u3059\u308B\u308F\uFF01");
                return [2, 'Carry over notice'];
        }
    });
}); };
exports.OverNotice = OverNotice;
var WaitNotice = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, sumi, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.TAIKI) {
                    if ([const_settings_1["default"].EMOJI_ID.TOOSHI, const_settings_1["default"].EMOJI_ID.MOCHIKOSHI].some(function (id) { return id === react.emoji.id; }))
                        return [2];
                    react.users.remove(user);
                    return [2];
                }
                return [4, fetchMessage(react)];
            case 1:
                msg = _a.sent();
                sumi = msg.reactions.cache.map(function (r) { return r; }).find(function (r) { return r.emoji.id === const_settings_1["default"].EMOJI_ID.SUMI; });
                if (sumi)
                    return [2];
                msg.react(const_settings_1["default"].EMOJI_ID.SUMI);
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send("<@!" + msg.author.id + "> " + msg.content + "\u306F\u5F85\u6A5F\u3067\u304A\u9858\u3044\u3059\u308B\u308F\uFF01");
                return [2, 'Carry over notice'];
        }
    });
}); };
exports.WaitNotice = WaitNotice;
var NoticeCancel = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, sumi;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                if (![const_settings_1["default"].EMOJI_ID.TOOSHI, const_settings_1["default"].EMOJI_ID.MOCHIKOSHI, const_settings_1["default"].EMOJI_ID.TAIKI].some(function (id) { return id === react.emoji.id; }))
                    return [2];
                return [4, fetchMessage(react)];
            case 1:
                msg = _a.sent();
                sumi = msg.reactions.cache.map(function (r) { return r; }).find(function (r) { return r.emoji.id === const_settings_1["default"].EMOJI_ID.SUMI; });
                sumi === null || sumi === void 0 ? void 0 : sumi.remove();
                return [2];
        }
    });
}); };
exports.NoticeCancel = NoticeCancel;
var fetchMessage = function (react) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = react.message;
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(msg.id)];
            case 1:
                _a.sent();
                return [2, msg];
        }
    });
}); };
