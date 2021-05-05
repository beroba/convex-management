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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
exports.AllRemove = exports.Remove = exports.Delete = exports.Already = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var schedule = __importStar(require("../../io/schedule"));
var list = __importStar(require("./list"));
var declaration = __importStar(require("../declare/declaration"));
var Already = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.KANRYOU)
                    return [2];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages.fetch(react.message.id)];
            case 1:
                _a.sent();
                if (react.message.author.id !== user.id)
                    return [2];
                react.message["delete"]();
                return [2, 'Already completed message'];
        }
    });
}); };
exports.Already = Already;
var Delete = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var plans, state;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (msg.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE)
                    return [2];
                if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
                    return [2];
                return [4, planDelete(msg)];
            case 1:
                plans = _b.sent();
                return [4, list.SituationEdit(plans)];
            case 2:
                _b.sent();
                return [4, current.Fetch()];
            case 3:
                state = _b.sent();
                declaration.SetUser(state);
                return [2, 'Delete completed message'];
        }
    });
}); };
exports.Delete = Delete;
var Remove = function (alpha, id) { return __awaiter(void 0, void 0, void 0, function () {
    var plans, plan, channel, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, schedule.FetchBoss(alpha)];
            case 1:
                plans = _a.sent();
                plan = plans.find(function (p) { return p.playerID === id; });
                if (!plan)
                    return [2];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages.fetch(plan.senderID)];
            case 2:
                msg = _a.sent();
                msg["delete"]();
                console.log('Delete completed message');
                return [2];
        }
    });
}); };
exports.Remove = Remove;
var AllRemove = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, msgs, list, list_1, list_1_1, m, e_1_1, plans;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages.fetch()];
            case 1:
                msgs = _b.sent();
                list = msgs.map(function (v) { return v; }).filter(function (m) { return m.author.id === id; });
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, 8, 9]);
                list_1 = __values(list), list_1_1 = list_1.next();
                _b.label = 3;
            case 3:
                if (!!list_1_1.done) return [3, 6];
                m = list_1_1.value;
                m["delete"]();
                return [4, util.Sleep(3000)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                list_1_1 = list_1.next();
                return [3, 3];
            case 6: return [3, 9];
            case 7:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 9];
            case 8:
                try {
                    if (list_1_1 && !list_1_1.done && (_a = list_1["return"])) _a.call(list_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 9: return [4, schedule.Fetch()];
            case 10:
                plans = _b.sent();
                Promise.all(plans.filter(function (p) { return p.playerID === id; }).map(function (p) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, schedule.Delete(p.senderID)];
                        case 1: return [2, _a.sent()];
                    }
                }); }); }));
                console.log('Delete all convex schedules');
                return [2];
        }
    });
}); };
exports.AllRemove = AllRemove;
var planDelete = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, plans, plan;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, schedule.Delete(msg.id)];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 2]), plans = _a[0], plan = _a[1];
                if (!plan)
                    return [2, plans];
                return [4, util.Sleep(100)];
            case 2:
                _b.sent();
                return [4, calMsgDel(plan.calID)];
            case 3:
                _b.sent();
                return [4, unroleBoss(plans, plan, msg)];
            case 4:
                _b.sent();
                return [2, plans];
        }
    });
}); };
var calMsgDel = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_RESERVATE);
                return [4, channel.messages
                        .fetch(id)
                        .then(function (m) { return m; })["catch"](function (_) { return undefined; })];
            case 1:
                msg = _a.sent();
                if (!msg)
                    return [2];
                msg["delete"]();
                return [2];
        }
    });
}); };
var unroleBoss = function (plans, plan, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var find;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                find = plans.filter(function (p) { return p.alpha === plan.alpha; }).find(function (p) { return p.playerID === plan.playerID; });
                if (find)
                    return [2];
                return [4, ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.remove(const_settings_1["default"].BOSS_ROLE_ID[plan.alpha]))];
            case 1:
                _b.sent();
                return [2];
        }
    });
}); };
