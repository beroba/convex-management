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
exports.Display = exports.Remove = exports.Add = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var status = __importStar(require("../../io/status"));
var Add = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME)
                    return [2];
                if (![const_settings_1["default"].TIME_LIMIT_EMOJI.FIRST, const_settings_1["default"].TIME_LIMIT_EMOJI.LATTER].some(function (id) { return id === react.message.id; }))
                    return [2];
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _a.sent();
                if (!member) {
                    react.users.remove(user);
                    return [2];
                }
                update(user.id);
                return [2, 'Setting the activity limit time'];
        }
    });
}); };
exports.Add = Add;
var Remove = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (user.bot)
            return [2];
        if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME)
            return [2];
        if (![const_settings_1["default"].TIME_LIMIT_EMOJI.FIRST, const_settings_1["default"].TIME_LIMIT_EMOJI.LATTER].some(function (id) { return id === react.message.id; }))
            return [2];
        update(user.id);
        return [2, 'Setting the activity limit time'];
    });
}); };
exports.Remove = Remove;
var update = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var member, _a, members;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, status.FetchMember(id)];
            case 1:
                member = _b.sent();
                if (!member)
                    return [2];
                _a = member;
                return [4, fetchLimit(id)];
            case 2:
                _a.limit = _b.sent();
                return [4, status.UpdateMember(member)];
            case 3:
                members = _b.sent();
                return [4, util.Sleep(100)];
            case 4:
                _b.sent();
                exports.Display(members);
                status.ReflectOnSheet(member);
                return [2];
        }
    });
}); };
var fetchLimit = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, first, latter, f, l, list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME);
                return [4, channel.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.FIRST)];
            case 1:
                first = _a.sent();
                return [4, channel.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.LATTER)];
            case 2:
                latter = _a.sent();
                return [4, Promise.all(first.reactions.cache
                        .map(function (r) { return r; })
                        .filter(function (r) { return r.users.cache.map(function (u) { return u.id; }).some(function (u) { return u === id; }); })
                        .map(function (r) { return r.emoji.name.replace('_', ''); }))];
            case 3:
                f = _a.sent();
                return [4, Promise.all(latter.reactions.cache
                        .map(function (r) { return r; })
                        .filter(function (r) { return r.users.cache.map(function (u) { return u.id; }).some(function (u) { return u === id; }); })
                        .map(function (r) { return r.emoji.name.replace('_', ''); }))];
            case 4:
                l = _a.sent();
                list = f.concat(l);
                return [2, list.last() !== undefined ? list.last() : ''];
        }
    });
}); };
var Display = function (members) { return __awaiter(void 0, void 0, void 0, function () {
    var h, over, now, oneNext, twoNext, text, channel, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                h = getHours();
                over = overMember(h, members);
                now = limitMember(h, members);
                oneNext = limitMember(h + 1, members);
                twoNext = limitMember(h + 2, members);
                text = [
                    '活動限界時間',
                    '```',
                    "over: " + over,
                    h % 24 + ": " + now,
                    (h + 1) % 24 + ": " + oneNext,
                    (h + 2) % 24 + ": " + twoNext,
                    '```',
                ].join('\n');
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME);
                return [4, channel.messages.fetch(const_settings_1["default"].TIME_LIMIT_EMOJI.DISPLAY)];
            case 1:
                msg = _a.sent();
                msg.edit(text);
                console.log('Updated activity time limit display');
                return [2];
        }
    });
}); };
exports.Display = Display;
var getHours = function () {
    var h = new Date().getHours();
    return createTime(h);
};
var createTime = function (num) {
    var n = Number(num);
    return n < 5 ? n + 24 : n;
};
var overMember = function (h, members) {
    return members
        .filter(function (m) {
        if (m.limit === '')
            return false;
        return createTime(m.limit) < h;
    })
        .filter(function (m) { return !m.end; })
        .sort(function (a, b) { return createTime(a.limit) - createTime(b.limit); })
        .map(function (m) { return m.name + "[" + m.limit + "]"; })
        .join(', ');
};
var limitMember = function (h, members) {
    return members
        .filter(function (m) {
        if (m.limit === '')
            return false;
        return createTime(m.limit) === h;
    })
        .filter(function (m) { return !m.end; })
        .map(function (m) { return "" + m.name; })
        .join(', ');
};
