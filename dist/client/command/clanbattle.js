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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ClanBattle = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var alphabet_to_number_1 = require("alphabet-to-number");
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var status = __importStar(require("../../io/status"));
var schedule = __importStar(require("../../io/schedule"));
var lapAndBoss = __importStar(require("../convex/lapAndBoss"));
var manage = __importStar(require("../convex/manage"));
var situation = __importStar(require("../convex/situation"));
var cancel = __importStar(require("../plan/delete"));
var list = __importStar(require("../plan/list"));
exports.ClanBattle = function (command, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, arg, members, members, arg, arg, arg, arg, members, plans, members;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.CLAN_BATTLE, msg.channel))
                    return [2];
                _a = true;
                switch (_a) {
                    case /cb convex/.test(command): return [3, 1];
                    case /cb boss now/.test(command): return [3, 3];
                    case /cb boss next/.test(command): return [3, 4];
                    case /cb boss back/.test(command): return [3, 7];
                    case /cb boss previous/.test(command): return [3, 7];
                    case /cb boss/.test(command): return [3, 10];
                    case /cb remove plan/.test(command): return [3, 12];
                    case /cb plan/.test(command): return [3, 13];
                    case /cb over/.test(command): return [3, 14];
                    case /cb task/.test(command): return [3, 15];
                    case /cb update report/.test(command): return [3, 16];
                    case /cb reflect/.test(command): return [3, 20];
                    case /cb help/.test(command): return [3, 26];
                }
                return [3, 27];
            case 1:
                arg = command.replace('/cb convex ', '');
                return [4, manage.Update(arg, msg)];
            case 2:
                _b.sent();
                return [2, 'Change of convex management'];
            case 3:
                {
                    lapAndBoss.ProgressReport();
                    return [2, 'Show current boss'];
                }
                _b.label = 4;
            case 4: return [4, lapAndBoss.Next()];
            case 5:
                _b.sent();
                return [4, status.Fetch()];
            case 6:
                members = _b.sent();
                situation.Report(members);
                return [2, 'Advance to next lap and boss'];
            case 7: return [4, lapAndBoss.Previous()];
            case 8:
                _b.sent();
                return [4, status.Fetch()];
            case 9:
                members = _b.sent();
                situation.Report(members);
                return [2, 'Advance to previous lap and boss'];
            case 10:
                arg = command.replace('/cb boss ', '');
                return [4, changeBoss(arg, msg)];
            case 11:
                _b.sent();
                return [2, 'Change laps and boss'];
            case 12:
                {
                    arg = command.replace('/cb complete plan ', '');
                    removePlan(arg, msg);
                    return [2, 'All reset plan'];
                }
                _b.label = 13;
            case 13:
                {
                    arg = command.replace('/cb plan ', '');
                    planList(arg);
                    return [2, 'Display convex plan list'];
                }
                _b.label = 14;
            case 14:
                {
                    arg = command.replace('/cb over ', '');
                    simultConvexCalc(arg, msg);
                    return [2, 'Simultaneous convex carryover calculation'];
                }
                _b.label = 15;
            case 15:
                {
                    addTaskKillRoll(msg);
                    return [2, 'Add task kill roll'];
                }
                _b.label = 16;
            case 16: return [4, status.Fetch()];
            case 17:
                members = _b.sent();
                situation.Report(members);
                return [4, schedule.Fetch()];
            case 18:
                plans = _b.sent();
                return [4, list.SituationEdit(plans)];
            case 19:
                _b.sent();
                msg.reply('凸状況を更新したわよ！');
                return [2, 'Convex situation updated'];
            case 20: return [4, current.ReflectOnCal()];
            case 21:
                _b.sent();
                return [4, util.Sleep(100)];
            case 22:
                _b.sent();
                return [4, status.ReflectOnCal()];
            case 23:
                _b.sent();
                return [4, util.Sleep(100)];
            case 24:
                _b.sent();
                return [4, status.Fetch()];
            case 25:
                members = _b.sent();
                situation.Report(members);
                msg.reply('スプレッドシートの値をキャルに反映させたわよ！');
                return [2, 'Reflect spreadsheet values ​​in Cal'];
            case 26:
                {
                    msg.reply('ここを確認しなさい！\nhttps://github.com/beroba/convex-management/blob/master/docs/command.md');
                    return [2, 'Show help'];
                }
                _b.label = 27;
            case 27: return [2];
        }
    });
}); };
var changeBoss = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var result, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, lapAndBoss.Update(arg)];
            case 1:
                result = _a.sent();
                if (!result)
                    return [2, msg.reply('形式が違うわ、やりなおし！')];
                return [4, status.Fetch()];
            case 2:
                members = _a.sent();
                situation.Report(members);
                return [2];
        }
    });
}); };
var removePlan = function (arg, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (arg === '/cb complete plan')
                    return [2, msg.reply('凸予定をリセットする人が分からないわ')];
                id = util.Format(arg).replace(/[^0-9]/g, '');
                return [4, cancel.AllRemove(id)];
            case 1:
                _a.sent();
                msg.reply('凸予定をリセットしたわ');
                return [2];
        }
    });
}); };
var planList = function (arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (/^[a-e]$/i.test(arg)) {
            list.Output(arg);
        }
        else if (/^[1-5]$/i.test(arg)) {
            list.Output(alphabet_to_number_1.NtoA(arg));
        }
        else {
            list.AllOutput();
        }
        return [2];
    });
}); };
var simultConvexCalc = function (arg, msg) {
    var _a = __read(arg.replace(/　/g, ' ').split(' ').map(Number), 3), HP = _a[0], A = _a[1], B = _a[2];
    var word = 'ダメージの高い方を先に通した方が持ち越し時間が長くなるわよ！';
    msg.reply("```A " + overCalc(HP, A, B) + "s\nB " + overCalc(HP, B, A) + "s```" + word);
};
var overCalc = function (HP, a, b) { return Math.ceil(90 - (((HP - a) * 90) / b - 20)); };
var addTaskKillRoll = function (msg) {
    var _a;
    var isRole = util.IsRole(msg.member, const_settings_1["default"].ROLE_ID.TASK_KILL);
    if (isRole) {
        msg.reply('既にタスキルしてるわ');
    }
    else {
        (_a = msg.member) === null || _a === void 0 ? void 0 : _a.roles.add(const_settings_1["default"].ROLE_ID.TASK_KILL);
        msg.reply('タスキルロールを付けたわよ！');
    }
};
