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
exports.Management = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var command = __importStar(require("./"));
var util = __importStar(require("../../util"));
var current = __importStar(require("../../io/current"));
var bossTable = __importStar(require("../../io/bossTable"));
var dateTable = __importStar(require("../../io/dateTable"));
var status = __importStar(require("../../io/status"));
var category = __importStar(require("../convex/category"));
var activityTime = __importStar(require("../convex/activityTime"));
var etc = __importStar(require("../convex/etc"));
var react = __importStar(require("../convex/react"));
var situation = __importStar(require("../convex/situation"));
var Management = function (content, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var isRole, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!util.IsChannel(const_settings_1["default"].COMMAND_CHANNEL.MANAGEMENT, msg.channel))
                    return [2];
                isRole = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.cache.some(function (r) { return const_settings_1["default"].COMMAND_ROLE.some(function (v) { return v === r.id; }); });
                if (!isRole)
                    return [2];
                _a = true;
                switch (_a) {
                    case /cb manage reflect/.test(content): return [3, 1];
                    case /cb manage create category/.test(content): return [3, 3];
                    case /cb manage delete category/.test(content): return [3, 5];
                    case /cb manage set days/.test(content): return [3, 7];
                    case /cb manage set boss/.test(content): return [3, 9];
                    case /cb manage remove role/.test(content): return [3, 11];
                    case /cb manage update members/.test(content): return [3, 13];
                    case /cb manage update sisters/.test(content): return [3, 15];
                    case /cb manage set react/.test(content): return [3, 17];
                    case /cb manage reflect activity time/.test(content): return [3, 19];
                }
                return [3, 21];
            case 1: return [4, reflectController('/cb manage reflect', content, msg)];
            case 2:
                _c.sent();
                return [2, 'Reflect spreadsheet values ​​in Cal'];
            case 3: return [4, createCategoryController('/cb manage create category', content, msg)];
            case 4:
                _c.sent();
                return [2, 'Create ClanBattle category'];
            case 5: return [4, deleteCategoryController('/cb manage delete category', content, msg)];
            case 6:
                _c.sent();
                return [2, 'Delete ClanBattle category'];
            case 7: return [4, setDaysController('/cb manage set days', content, msg)];
            case 8:
                _c.sent();
                return [2, 'Set convex days'];
            case 9: return [4, setBossController('/cb manage set boss', content, msg)];
            case 10:
                _c.sent();
                return [2, 'Set convex bossTable'];
            case 11: return [4, removeRoleController('/cb manage remove role', content, msg)];
            case 12:
                _c.sent();
                return [2, 'Release all remaining convex rolls'];
            case 13: return [4, updateMembersController('/cb manage update members', content, msg)];
            case 14:
                _c.sent();
                return [2, 'Update convex management members'];
            case 15: return [4, updateSistersController('/cb manage update sisters', content, msg)];
            case 16:
                _c.sent();
                return [2, 'Update convex management sisters'];
            case 17: return [4, setReactController('/cb manage set react', content, msg)];
            case 18:
                _c.sent();
                return [2, 'Set react for convex'];
            case 19: return [4, reflectActivityTimeController('/cb manage reflect activity time', content, msg)];
            case 20:
                _c.sent();
                return [2, 'Reflect activity time on the sheet'];
            case 21: return [2];
        }
    });
}); };
exports.Management = Management;
var reflectController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var members;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, current.ReflectOnCal()];
            case 1:
                _a.sent();
                return [4, util.Sleep(100)];
            case 2:
                _a.sent();
                return [4, status.ReflectOnCal()];
            case 3:
                _a.sent();
                return [4, util.Sleep(100)];
            case 4:
                _a.sent();
                return [4, status.Fetch()];
            case 5:
                members = _a.sent();
                situation.Report(members);
                _msg.reply('スプレッドシートの値をキャルに反映させたわよ！');
                return [2];
        }
    });
}); };
var createCategoryController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, _a, year, month;
    return __generator(this, function (_b) {
        args = command.ExtractArgument(_command, _content);
        _a = __read(args ? args.split('/').map(Number) : (function (d) { return [d.getFullYear(), d.getMonth() + 1]; })(new Date()), 2), year = _a[0], month = _a[1];
        category.Create(year, month, _msg);
        return [2];
    });
}); };
var deleteCategoryController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args, _a, year, month;
    return __generator(this, function (_b) {
        args = command.ExtractArgument(_command, _content);
        if (!args)
            return [2, _msg.reply('削除したい年と月を入力しなさい！')];
        _a = __read(args.split('/').map(Number), 2), year = _a[0], month = _a[1];
        category.Delete(year, month, _msg);
        return [2];
    });
}); };
var setDaysController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    var args;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = command.ExtractArgument(_command, _content);
                return [4, dateTable.Update(args)];
            case 1:
                _a.sent();
                _msg.reply('クランバトルの日付を設定したわよ！');
                return [2];
        }
    });
}); };
var setBossController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, bossTable.Update()];
            case 1:
                _a.sent();
                _msg.reply('クランバトルのボステーブルを設定したわよ！');
                return [2];
        }
    });
}); };
var removeRoleController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        etc.RemoveRole();
        _msg.reply('凸残ロール全て外したわよ！');
        return [2];
    });
}); };
var updateMembersController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (_msg.author.id !== const_settings_1["default"].ADMIN_ID) {
                    _msg.reply('botの管理者に更新して貰うように言ってね');
                    return [2];
                }
                return [4, etc.UpdateMembers(_msg)];
            case 1:
                _a.sent();
                _msg.reply('クランメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var updateSistersController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, etc.UpdateSisters(_msg)];
            case 1:
                _a.sent();
                _msg.reply('妹クランメンバー一覧を更新したわよ！');
                return [2];
        }
    });
}); };
var setReactController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, react.SetDeclare()];
            case 1:
                _a.sent();
                return [4, react.SetActivityTime()];
            case 2:
                _a.sent();
                _msg.reply('凸管理用の絵文字を設定したわよ！');
                return [2];
        }
    });
}); };
var reflectActivityTimeController = function (_command, _content, _msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, activityTime.ReflectOnSheet()];
            case 1:
                _a.sent();
                _msg.reply('凸管理用の絵文字を設定したわよ！');
                return [2];
        }
    });
}); };
