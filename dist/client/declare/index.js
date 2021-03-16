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
exports.SetPlanList = exports.ChangeBoss = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var schedule = __importStar(require("../../io/schedule"));
var list = __importStar(require("../plan/list"));
var declaration = __importStar(require("./declaration"));
var status = __importStar(require("./status"));
exports.ChangeBoss = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!state)
                    return [2];
                status.Update(state);
                exports.SetPlanList(state);
                return [4, declaration.ResetReact()];
            case 1:
                _a.sent();
                declaration.SetUser(state);
                messageDelete();
                return [2];
        }
    });
}); };
exports.SetPlanList = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, plan, plans, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                return [4, channel.messages.fetch(const_settings_1["default"].CONVEX_DECLARE_ID.PLAN)];
            case 1:
                plan = _a.sent();
                return [4, schedule.Fetch()];
            case 2:
                plans = _a.sent();
                return [4, list.CreatePlanText(state.alpha, state.stage, plans)];
            case 3:
                text = _a.sent();
                plan.edit('凸予定\n' + text.split('\n').slice(1).join('\n'));
                return [2];
        }
    });
}); };
var messageDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
    var channel, list, _a, _b, users;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_DECLARE);
                _b = (_a = Promise).all;
                return [4, channel.messages.fetch()];
            case 1: return [4, _b.apply(_a, [(_c.sent())
                        .map(function (m) { return m; })
                        .filter(function (m) { return !m.author.bot; })
                        .map(function (m) { return m["delete"](); })])];
            case 2:
                list = _c.sent();
                users = list
                    .filter(function (m) { return !m.reactions.cache.map(function (r) { return r; }).find(function (r) { return r.emoji.id === const_settings_1["default"].EMOJI_ID.SUMI; }); })
                    .map(function (m) { return m.author; });
                if (!users.length)
                    return [2];
                releaseNotice(users);
                return [2];
        }
    });
}); };
var releaseNotice = function (users) {
    var mentions = users
        .filter(function (n, i, e) { return e.indexOf(n) == i; })
        .map(function (u) { return "<@!" + u.id + ">"; })
        .join(' ');
    var channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
    channel.send(mentions + " \u30DC\u30B9\u304C\u8A0E\u4F10\u3055\u308C\u305F\u304B\u3089\u901A\u3057\u3066\u5927\u4E08\u592B\u3088\uFF01");
    console.log('Release notice');
};
