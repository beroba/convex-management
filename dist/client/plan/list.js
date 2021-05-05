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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.CreatePlanText = exports.SituationEdit = exports.AllOutput = exports.Output = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var bossTable = __importStar(require("../../io/bossTable"));
var current = __importStar(require("../../io/current"));
var schedule = __importStar(require("../../io/schedule"));
var status = __importStar(require("../../io/status"));
var declare = __importStar(require("../declare"));
var Output = function (alpha) { return __awaiter(void 0, void 0, void 0, function () {
    var state, plans, text, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, current.Fetch()];
            case 1:
                state = _a.sent();
                return [4, schedule.Fetch()];
            case 2:
                plans = _a.sent();
                return [4, exports.CreatePlanText(alpha, state.stage, plans)];
            case 3:
                text = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(text);
                return [2];
        }
    });
}); };
exports.Output = Output;
var AllOutput = function () { return __awaiter(void 0, void 0, void 0, function () {
    var plans, text, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, schedule.Fetch()];
            case 1:
                plans = _a.sent();
                return [4, createAllPlanText(plans)];
            case 2:
                text = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(text);
                return [2];
        }
    });
}); };
exports.AllOutput = AllOutput;
var SituationEdit = function (plans) { return __awaiter(void 0, void 0, void 0, function () {
    var text, channel, msg, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, createAllPlanText(plans)];
            case 1:
                text = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_SITUATION);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_MESSAGE_ID.PLAN)];
            case 2:
                msg = _a.sent();
                msg.edit(text);
                return [4, current.Fetch()];
            case 3:
                state = _a.sent();
                return [4, util.Sleep(500)];
            case 4:
                _a.sent();
                return [4, declare.SetPlanList(state)];
            case 5:
                _a.sent();
                console.log('Edit the convex schedule of the convex situation');
                return [2];
        }
    });
}); };
exports.SituationEdit = SituationEdit;
var CreatePlanText = function (alpha, stage, plans) { return __awaiter(void 0, void 0, void 0, function () {
    var p, text, name, hp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Promise.all(plans
                    .filter(function (p) { return p.alpha === alpha; })
                    .map(function (p) { return __awaiter(void 0, void 0, void 0, function () {
                    var member, bool, m;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, util.MemberFromId(p.playerID)];
                            case 1:
                                member = _a.sent();
                                bool = util.IsRole(member, const_settings_1["default"].ROLE_ID.AWAY_IN);
                                return [4, status.FetchMember(p.playerID)];
                            case 2:
                                m = _a.sent();
                                return [2, p.name + "[" + ((m === null || m === void 0 ? void 0 : m.convex) ? m === null || m === void 0 ? void 0 : m.convex : '0') + ((m === null || m === void 0 ? void 0 : m.over) ? '+' : '') + ((m === null || m === void 0 ? void 0 : m.limit) !== '' ? ", " + (m === null || m === void 0 ? void 0 : m.limit) + "\u6642" : '') + "]" + (bool ? '(離席中)' : '') + " " + p.msg];
                        }
                    });
                }); }))];
            case 1:
                p = _a.sent();
                text = __spreadArray([], __read(new Set(p))).filter(function (m) { return m !== ''; }).join('\n');
                return [4, bossTable.TakeName(alpha)];
            case 2:
                name = _a.sent();
                hp = const_settings_1["default"].STAGE_HP[stage][alpha];
                return [2, name + " `" + hp + "`\n```\n" + (/^\s*$/.test(text) ? ' ' : text) + "\n```"];
        }
    });
}); };
exports.CreatePlanText = CreatePlanText;
var createAllPlanText = function (plans) { return __awaiter(void 0, void 0, void 0, function () {
    var state, stage, a, b, c, d, e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, current.Fetch()];
            case 1:
                state = _a.sent();
                stage = state.stage;
                return [4, exports.CreatePlanText('a', stage, plans)];
            case 2:
                a = _a.sent();
                return [4, exports.CreatePlanText('b', stage, plans)];
            case 3:
                b = _a.sent();
                return [4, exports.CreatePlanText('c', stage, plans)];
            case 4:
                c = _a.sent();
                return [4, exports.CreatePlanText('d', stage, plans)];
            case 5:
                d = _a.sent();
                return [4, exports.CreatePlanText('e', stage, plans)];
            case 6:
                e = _a.sent();
                return [2, [a, b, c, d, e].join('\n')];
        }
    });
}); };
