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
exports.ClanBattle = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var alphabet_to_number_1 = require("alphabet-to-number");
var command = __importStar(require("./"));
var util = __importStar(require("../../util"));
var status = __importStar(require("../../io/status"));
var schedule = __importStar(require("../../io/schedule"));
var etc = __importStar(require("../convex/etc"));
var format = __importStar(require("../convex/format"));
var lapAndBoss = __importStar(require("../convex/lapAndBoss"));
var manage = __importStar(require("../convex/manage"));
var situation = __importStar(require("../convex/situation"));
var list = __importStar(require("../plan/list"));
var ClanBattle = function (content, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.CLAN_BATTLE, msg.channel))
                    return [2];
                _a = true;
                switch (_a) {
                    case /cb tl/i.test(content): return [3, 1];
                    case /cb convex/.test(content): return [3, 3];
                    case /cb boss now/.test(content): return [3, 5];
                    case /cb boss next/.test(content): return [3, 7];
                    case /cb boss back/.test(content): return [3, 9];
                    case /cb boss previous/.test(content): return [3, 11];
                    case /cb boss/.test(content): return [3, 13];
                    case /cb delete plan/.test(content): return [3, 15];
                    case /cb plan/.test(content): return [3, 17];
                    case /cb over/.test(content): return [3, 19];
                    case /cb task/.test(content): return [3, 21];
                    case /cb kill/.test(content): return [3, 23];
                    case /cb update report/.test(content): return [3, 25];
                    case /cb help/.test(content): return [3, 27];
                }
                return [3, 29];
            case 1: return [4, tlController('/cb tl', content, msg)];
            case 2:
                _b.sent();
                return [2, 'TL shaping'];
            case 3: return [4, convexController('/cb convex', content, msg)];
            case 4:
                _b.sent();
                return [2, 'Change of convex management'];
            case 5: return [4, bossNowController('/cb boss now', content, msg)];
            case 6:
                _b.sent();
                return [2, 'Show current boss'];
            case 7: return [4, bossNextController('/cb boss next', content, msg)];
            case 8:
                _b.sent();
                return [2, 'Advance to next lap and boss'];
            case 9: return [4, bossPreviousController('/cb boss back', content, msg)];
            case 10:
                _b.sent();
                return [2, 'Advance to previous lap and boss'];
            case 11: return [4, bossPreviousController('/cb boss previous', content, msg)];
            case 12:
                _b.sent();
                return [2, 'Advance to previous lap and boss'];
            case 13: return [4, bossController('/cb boss', content, msg)];
            case 14:
                _b.sent();
                return [2, 'Change laps and boss'];
            case 15: return [4, deletePlanController('/cb delete plan', content, msg)];
            case 16:
                _b.sent();
                return [2, 'Delete plan'];
            case 17: return [4, planController('/cb plan', content, msg)];
            case 18:
                _b.sent();
                return [2, 'Display convex plan list'];
            case 19: return [4, overController('/cb over', content, msg)];
            case 20:
                _b.sent();
                return [2, 'Simultaneous convex carryover calculation'];
            case 21: return [4, taskKillController('/cb task', content, msg)];
            case 22:
                _b.sent();
                return [2, 'Add task kill roll'];
            case 23: return [4, taskKillController('/cb kill', content, msg)];
            case 24:
                _b.sent();
                return [2, 'Add task kill roll'];
            case 25: return [4, updateReportController('/cb update report', content, msg)];
            case 26:
                _b.sent();
                return [2, 'Convex situation updated'];
            case 27: return [4, helpController('/cb help', content, msg)];
            case 28:
                _b.sent();
                return [2, 'Show help'];
            case 29: return [2];
        }
    });
}); };
exports.ClanBattle = ClanBattle;
var tlController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var toTime, args, tl, time;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toTime = function (args) {
                    var time = args.replace(/\.|;/g, ':');
                    var isNaN = Number.isNaN(Number(time.replace(':', '')));
                    return isNaN ? null : time;
                };
                args = command.ExtractArgument(_command, _content);
                tl = _msg.content.split('\n').slice(1).join('\n');
                if (!tl)
                    return [2, _msg.reply('TLがないわ')];
                time = args && toTime(args);
                return [4, format.TL(tl, time, _msg)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var convexController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = command.ExtractArgument(_command, _content);
                if (!args)
                    return [2, _msg.reply('更新したいプレイヤーと凸状況を指定しなさい')];
                state = util
                    .Format(args)
                    .replace(/<.+>/, '')
                    .trim();
                if (!/^(0|[1-3]\+?)$/.test(state))
                    return [2, _msg.reply('凸状況の書式が違うわ')];
                return [4, manage.Update(state, _msg)];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var bossNowController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, lapAndBoss.ProgressReport()];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var bossNextController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, lapAndBoss.Next()];
            case 1:
                _a.sent();
                return [4, status.Fetch()];
            case 2:
                members = _a.sent();
                return [4, situation.Report(members)];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
var bossPreviousController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, lapAndBoss.Previous()];
            case 1:
                _a.sent();
                return [4, status.Fetch()];
            case 2:
                members = _a.sent();
                return [4, situation.Report(members)];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
var bossController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, lap, alpha, members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = command.ExtractArgument(_command, _content);
                if (!args)
                    return [2, _msg.reply('周回数とボス番号を指定しなさい')];
                lap = util.Format(args).replace(/\s|[a-e]/gi, '');
                alpha = util.Format(args).replace(/\s|\d/gi, '');
                if (!/\d/.test(lap))
                    return [2, _msg.reply('周回数の書式が違うわ')];
                if (!/[a-e]/i.test(alpha))
                    return [2, _msg.reply('ボス番号の書式が違うわ、[a-e]で指定してね')];
                return [4, lapAndBoss.Update(lap, alpha)];
            case 1:
                _a.sent();
                return [4, status.Fetch()];
            case 2:
                members = _a.sent();
                return [4, situation.Report(members)];
            case 3:
                _a.sent();
                return [2];
        }
    });
}); };
var deletePlanController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, id, _a, plans;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                args = command.ExtractArgument(_command, _content);
                if (!args)
                    return [2, _msg.reply('削除する凸予定のidを指定しないと消せないわ')];
                id = util.Format(args).replace(/[^0-9]/g, '');
                return [4, schedule.Delete(id)];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 1]), plans = _a[0];
                return [4, list.SituationEdit(plans)];
            case 2:
                _b.sent();
                _msg.reply('凸予定を削除したわ');
                return [2];
        }
    });
}); };
var planController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args;
    var _a;
    return __generator(this, function (_b) {
        args = (_a = command.ExtractArgument(_command, _content)) !== null && _a !== void 0 ? _a : '';
        if (/^[a-e]$/i.test(args)) {
            list.Output(args);
        }
        else if (/^[1-5]$/i.test(args)) {
            list.Output(alphabet_to_number_1.NtoA(args));
        }
        else {
            list.AllOutput();
        }
        return [2];
    });
}); };
var overController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, _a, HP, A, B;
    return __generator(this, function (_b) {
        args = command.ExtractArgument(_command, _content);
        if (!args)
            return [2, _msg.reply('HP A Bを指定しなさい')];
        _a = __read(util.Format(args).split(' ').map(Number), 3), HP = _a[0], A = _a[1], B = _a[2];
        etc.SimultConvexCalc(HP, A, B, _msg);
        return [2];
    });
}); };
var taskKillController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        etc.AddTaskKillRoll(_msg);
        return [2];
    });
}); };
var updateReportController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var members, plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, status.Fetch()];
            case 1:
                members = _a.sent();
                situation.Report(members);
                return [4, schedule.Fetch()];
            case 2:
                plans = _a.sent();
                return [4, list.SituationEdit(plans)];
            case 3:
                _a.sent();
                _msg.reply('凸状況を更新したわよ！');
                return [2];
        }
    });
}); };
var helpController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        url = 'https://github.com/beroba/convex-management/blob/master/docs/command.md';
        _msg.reply('ここを確認しなさい！\n' + url);
        return [2];
    });
}); };
