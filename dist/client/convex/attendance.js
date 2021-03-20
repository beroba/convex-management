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
exports.Edit = exports.Add = exports.Remove = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var status = __importStar(require("../../io/status"));
var schedule = __importStar(require("../../io/schedule"));
var list = __importStar(require("../plan/list"));
var declare = __importStar(require("../declare"));
exports.Remove = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member, plans, state;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME)
                    return [2];
                react.users.remove(user);
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _c.sent();
                if (!member)
                    return [2];
                if (react.message.id !== const_settings_1["default"].ACTIVITY_TIME.AWAY_IN)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.SHUSEKI)
                    return [2];
                (_b = (_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.map(function (m) { return m; }).find(function (m) { return m.id === user.id; })) === null || _b === void 0 ? void 0 : _b.roles.remove(const_settings_1["default"].ROLE_ID.AWAY_IN);
                return [4, util.Sleep(100)];
            case 2:
                _c.sent();
                return [4, exports.Edit()];
            case 3:
                _c.sent();
                return [4, schedule.Fetch()];
            case 4:
                plans = _c.sent();
                list.SituationEdit(plans);
                return [4, current.Fetch()];
            case 5:
                state = _c.sent();
                declare.SetPlanList(state);
                return [2, 'Remove the role away in'];
        }
    });
}); };
exports.Add = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var member, plans, state;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME)
                    return [2];
                react.users.remove(user);
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _c.sent();
                if (!member)
                    return [2];
                if (react.message.id !== const_settings_1["default"].ACTIVITY_TIME.AWAY_IN)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.RISEKI)
                    return [2];
                (_b = (_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.map(function (m) { return m; }).find(function (m) { return m.id === user.id; })) === null || _b === void 0 ? void 0 : _b.roles.add(const_settings_1["default"].ROLE_ID.AWAY_IN);
                return [4, util.Sleep(100)];
            case 2:
                _c.sent();
                return [4, exports.Edit()];
            case 3:
                _c.sent();
                return [4, schedule.Fetch()];
            case 4:
                plans = _c.sent();
                list.SituationEdit(plans);
                return [4, current.Fetch()];
            case 5:
                state = _c.sent();
                declare.SetPlanList(state);
                return [2, 'Remove the role away in'];
        }
    });
}); };
exports.Edit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var text, channel, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                text = [
                    "<@&" + const_settings_1["default"].ROLE_ID.AWAY_IN + "> \u306F\u3053\u306E\u30E1\u30C3\u30BB\u30FC\u30B8\u304C\u30AA\u30EC\u30F3\u30B8\u8272\u306B\u306A\u308A\u307E\u3059\u3002",
                    "\u30E1\u30C3\u30BB\u30FC\u30B8\u306B\u4ED8\u3051\u305F\u30EA\u30A2\u30AF\u30B7\u30E7\u30F3\u306F\u3059\u3050\u306B\u6D88\u3048\u307E\u3059\u3002\n",
                    "> \u51F8\u4E88\u5B9A\u304C\u8868\u793A\u3055\u308C\u306A\u3044\u5834\u5408\u306F\u3001" + const_settings_1["default"].EMOJI_FULL_ID.SHUSEKI + "\u3092\u62BC\u3057\u3066\u4E0B\u3055\u3044\u3002",
                    "> \u96E2\u5E2D\u3059\u308B\u969B\u306F\u3001" + const_settings_1["default"].EMOJI_FULL_ID.RISEKI + "\u3092\u62BC\u3057\u3066\u4E0B\u3055\u3044\u3002",
                ].join('\n');
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.ACTIVITY_TIME);
                return [4, channel.messages.fetch(const_settings_1["default"].ACTIVITY_TIME.AWAY_IN)];
            case 1:
                msg = _a.sent();
                return [4, msg.edit(text)];
            case 2:
                _a.sent();
                return [2];
        }
    });
}); };
