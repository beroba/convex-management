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
exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var status = __importStar(require("../../io/status"));
var etc = __importStar(require("./etc"));
var limitTime = __importStar(require("./limitTime"));
var situation = __importStar(require("./situation"));
var Update = function (state, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var user, member, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = msg.mentions.users.first();
                if (!user) {
                    msg.reply('メンションで誰の凸状況を変更したいか指定しなさい');
                    return [2];
                }
                return [4, status.FetchMember(user.id)];
            case 1:
                member = _a.sent();
                if (!member) {
                    msg.reply('その人はクランメンバーじゃないわ');
                    return [2];
                }
                if (!(state === '3')) return [3, 3];
                return [4, convexEndProcess(member, user, msg)];
            case 2:
                member = _a.sent();
                return [3, 5];
            case 3: return [4, updateProcess(member, state, user, msg)];
            case 4:
                member = _a.sent();
                _a.label = 5;
            case 5: return [4, status.UpdateMember(member)];
            case 6:
                members = _a.sent();
                return [4, util.Sleep(100)];
            case 7:
                _a.sent();
                status.ReflectOnSheet(member);
                situation.Report(members);
                return [2];
        }
    });
}); };
exports.Update = Update;
var convexEndProcess = function (member, user, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var guildMember, members, n;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                member.convex = '3';
                member.over = '';
                member.end = '1';
                return [4, util.MemberFromId(user.id)];
            case 1:
                guildMember = _a.sent();
                return [4, guildMember.roles.remove(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX)];
            case 2:
                _a.sent();
                return [4, etc.RemoveBossRole(guildMember)];
            case 3:
                _a.sent();
                return [4, status.Fetch()];
            case 4:
                members = _a.sent();
                n = members.filter(function (s) { return s.end === '1'; }).length + 1;
                msg.reply("3\u51F8\u76EE \u7D42\u4E86\n`" + n + "`\u4EBA\u76EE\u306E3\u51F8\u7D42\u4E86\u3088\uFF01");
                limitTime.Display(members);
                return [2, member];
        }
    });
}); };
var updateProcess = function (member, state, user, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var guildMember;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                member.convex = state[0] === '0' ? '' : state[0];
                member.over = state.includes('+') ? '1' : '';
                member.end = '';
                return [4, util.MemberFromId(user.id)];
            case 1:
                guildMember = _a.sent();
                guildMember.roles.add(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX);
                msg.reply(member.convex ? member.convex + "\u51F8\u76EE " + (member.over ? '持ち越し' : '終了') : '未凸');
                return [2, member];
        }
    });
}); };
