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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.UserMessageAllDelete = exports.MessageDelete = exports.RemainingHPChange = exports.React = exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
exports.Update = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var maxHP, channel, status, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                maxHP = const_settings_1["default"].STAGE_HP[state.stage][state.alpha];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_DECLARE_ID.STATUS)];
            case 1:
                status = _e.sent();
                _b = (_a = status).edit;
                _c = state.lap + "\u9031\u76EE " + state.boss + " `" + state.hp + "/" + maxHP + "`\n";
                _d = "\u4E88\u60F3\u6B8B\u308AHP `";
                return [4, expectRemainingHP(state)];
            case 2: return [4, _b.apply(_a, [_c + (_d + (_e.sent()) + "`")])];
            case 3:
                _e.sent();
                return [2];
        }
    });
}); };
exports.React = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var content, state;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
                    return [2];
                if (msg.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                content = util.Format(msg.content);
                content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content;
                if (!/@\d/.test(content)) return [3, 2];
                return [4, exports.RemainingHPChange(content)];
            case 1:
                _b.sent();
                msg["delete"]();
                return [2, 'Remaining HP change'];
            case 2: return [4, msg.react(const_settings_1["default"].EMOJI_ID.KAKUNIN)];
            case 3:
                _b.sent();
                return [4, msg.react(const_settings_1["default"].EMOJI_ID.MOCHIKOSHI)];
            case 4:
                _b.sent();
                console.log('Set declare reactions');
                return [4, current.Fetch()];
            case 5:
                state = _b.sent();
                exports.Update(state);
                return [2, 'Calculate the HP'];
        }
    });
}); };
exports.RemainingHPChange = function (content) { return __awaiter(void 0, void 0, void 0, function () {
    var at, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                at = content.replace(/^.*@/g, '').trim().replace(/\s.*$/g, '');
                return [4, current.UpdateBossHp(at)];
            case 1:
                state = _a.sent();
                return [4, exports.Update(state)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
var expectRemainingHP = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, list, damage, hp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch()];
            case 1:
                list = (_a.sent())
                    .map(function (m) { return m; })
                    .filter(function (m) { return !m.author.bot; })
                    .map(function (m) {
                    var content = util.Format(m.content);
                    content = /(?=.*@)(?=.*(s|秒))/.test(content) ? content.replace(/@/g, '') : content;
                    var list = content
                        .replace(/\d*(s|秒)/gi, '')
                        .trim()
                        .match(/[\d]+/g);
                    if (!list)
                        return;
                    return Math.max.apply(Math, __spread(list.map(Number)));
                })
                    .map(Number)
                    .map(function (n) { return (Number.isNaN(n) ? 0 : n); });
                damage = list.length ? list.reduce(function (a, b) { return a + b; }) : 0;
                hp = Number(state.hp) - damage;
                return [2, hp >= 0 ? hp : 0];
        }
    });
}); };
exports.MessageDelete = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var state;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
                    return [2];
                if (msg.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE)
                    return [2];
                return [4, current.Fetch()];
            case 1:
                state = _b.sent();
                exports.Update(state);
                return [2, 'Calculate the HP'];
        }
    });
}); };
exports.UserMessageAllDelete = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                _b = (_a = Promise).all;
                return [4, channel.messages.fetch()];
            case 1: return [4, _b.apply(_a, [(_c.sent())
                        .map(function (m) { return m; })
                        .filter(function (m) { return m.author.id === user.id; })
                        .map(function (m) { return m["delete"](); })])];
            case 2:
                _c.sent();
                return [2];
        }
    });
}); };
