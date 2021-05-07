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
exports.Fetch = exports.SetActivityTime = exports.SetDeclare = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var SetDeclare = function () { return __awaiter(void 0, void 0, void 0, function () {
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
exports.SetDeclare = SetDeclare;
var SetActivityTime = function () { return __awaiter(void 0, void 0, void 0, function () {
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
exports.SetActivityTime = SetActivityTime;
var Fetch = function () { return __awaiter(void 0, void 0, void 0, function () {
    var declare, msgs, activityTime, first, latter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                declare = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, declare.messages.fetch()];
            case 1:
                msgs = _a.sent();
                return [4, Promise.all(msgs.map(function (msg) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2, Promise.all(msg.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, r.users.fetch()];
                                    case 1: return [2, _a.sent()];
                                }
                            }); }); }))];
                    }); }); }))];
            case 2:
                _a.sent();
                activityTime = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME);
                return [4, activityTime.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.FIRST)];
            case 3:
                first = _a.sent();
                return [4, activityTime.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.LATTER)];
            case 4:
                latter = _a.sent();
                return [4, Promise.all(first.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, r.users.fetch()];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); }))];
            case 5:
                _a.sent();
                return [4, Promise.all(latter.reactions.cache.map(function (r) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, r.users.fetch()];
                            case 1: return [2, _a.sent()];
                        }
                    }); }); }))];
            case 6:
                _a.sent();
                return [2];
        }
    });
}); };
exports.Fetch = Fetch;
