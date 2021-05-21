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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Convex = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var status = __importStar(require("../../io/status"));
var update = __importStar(require("./update"));
var lapAndBoss = __importStar(require("../convex/lapAndBoss"));
var limitTime = __importStar(require("../convex/limitTime"));
var over = __importStar(require("../convex/over"));
var situation = __importStar(require("../convex/situation"));
var declare = __importStar(require("../declare/status"));
var react = __importStar(require("../declare/react"));
var cancel = __importStar(require("../plan/delete"));
var Convex = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var member_1, state, content, _a, members, member;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.user.bot)
                    return [2];
                if (msg.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_REPORT)
                    return [2];
                return [4, status.FetchMember(msg.author.id)];
            case 1:
                member_1 = _d.sent();
                if (!member_1) {
                    msg.reply('クランメンバーじゃないわ');
                    return [2, 'Not a clan member'];
                }
                if (member_1.end === '1') {
                    msg.reply('もう3凸してるわ');
                    return [2, '3 Convex is finished'];
                }
                return [4, current.Fetch()];
            case 2:
                state = _d.sent();
                content = util.Format(msg.content);
                if (!/^k|kill/i.test(content)) return [3, 4];
                return [4, declare.UserMessageAllDelete(msg.author)];
            case 3:
                _d.sent();
                lapAndBoss.Next();
                return [3, 5];
            case 4:
                react.ConvexDone(msg.author);
                if (/@\d/.test(content)) {
                    declare.RemainingHPChange(content);
                }
                _d.label = 5;
            case 5:
                overDelete(msg);
                return [4, update.Status(msg)];
            case 6:
                _a = __read.apply(void 0, [_d.sent(), 2]), members = _a[0], member = _a[1];
                if (!member)
                    return [2];
                return [4, util.Sleep(100)];
            case 7:
                _d.sent();
                status.ReflectOnSheet(member);
                if (!/;/i.test(content)) {
                    if ((member === null || member === void 0 ? void 0 : member.end) === '1') {
                        cancel.AllRemove(msg.author.id);
                    }
                    else {
                        cancel.Remove(state.alpha, msg.author.id);
                    }
                }
                situation.Report(members);
                limitTime.Display(members);
                return [4, ((_c = msg.member) === null || _c === void 0 ? void 0 : _c.roles.remove(const_settings_1["default"].ROLE_ID.AWAY_IN))];
            case 8:
                _d.sent();
                return [2, 'Update status'];
        }
    });
}); };
exports.Convex = Convex;
var overDelete = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var member;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, status.FetchMember(msg.author.id)];
            case 1:
                member = _a.sent();
                if ((member === null || member === void 0 ? void 0 : member.over) !== '1')
                    return [2];
                over.AllDelete(msg.member);
                return [2];
        }
    });
}); };
