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
exports.Report = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var lapAndBoss = __importStar(require("./lapAndBoss"));
var date = __importStar(require("./date"));
exports.Report = function () { return __awaiter(void 0, void 0, void 0, function () {
    var day, manageSheet, range, _a, status, members, list, channel, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4, date.GetDay()];
            case 1:
                day = _d.sent();
                if (!day)
                    return [2];
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 2:
                manageSheet = _d.sent();
                return [4, date.GetColumn(0)];
            case 3:
                _a = (_d.sent()) + "3:";
                return [4, date.GetColumn(1)];
            case 4:
                range = _a + (_d.sent()) + "32";
                return [4, spreadsheet.GetCells(manageSheet, range)];
            case 5:
                status = _d.sent();
                return [4, spreadsheet.GetCells(manageSheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 6:
                members = _d.sent();
                list = util
                    .PiecesEach(status, 2)
                    .map(function (v) { return v.map(Number); })
                    .map(function (v, i) { return __spread([members[i]], v); })
                    .filter(function (v) { return v[0] !== ''; });
                channel = util.GetTextChannel(const_settings_1["default"].CONVEX_CHANNEL.SITUATION_ID);
                _c = (_b = channel).send;
                return [4, createMessage(list)];
            case 7:
                _c.apply(_b, [_d.sent()]);
                console.log('Report convex situation');
                return [2];
        }
    });
}); };
var createMessage = function (list) { return __awaiter(void 0, void 0, void 0, function () {
    var p0, time, day, getUserList, 未凸, 持越1, 凸1, 持越2, 凸2, 持越3, 凸3, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                p0 = function (n) { return (n + '').padStart(2, '0'); };
                time = (function (d) {
                    return p0(d.getMonth() + 1) + "/" + p0(d.getDate()) + " " + p0(d.getHours()) + ":" + p0(d.getMinutes());
                })(new Date());
                return [4, date.GetDay()];
            case 1:
                day = (_c.sent()) + "\u65E5\u76EE";
                getUserList = function (list, a, b) {
                    return list.filter(function (l) { return l[1] === a; }).filter(function (l) { return l[2] === b; }).map(function (l) { return l[0]; }).join(', ');
                };
                未凸 = getUserList(list, 0, 0);
                持越1 = getUserList(list, 1, 1);
                凸1 = getUserList(list, 1, 0);
                持越2 = getUserList(list, 2, 1);
                凸2 = getUserList(list, 2, 0);
                持越3 = getUserList(list, 3, 1);
                凸3 = getUserList(list, 3, 0);
                _a = "`" + time + "` " + day + " \u51F8\u72B6\u6CC1\u4E00\u89A7\n" +
                    '```\n' +
                    ("\u672A\u51F8: " + 未凸 + "\n") +
                    '\n' +
                    ("\u6301\u8D8A: " + 持越1 + "\n") +
                    ("1\u51F8 : " + 凸1 + "\n") +
                    '\n' +
                    ("\u6301\u8D8A: " + 持越2 + "\n") +
                    ("2\u51F8 : " + 凸2 + "\n") +
                    '\n' +
                    ("\u6301\u8D8A: " + 持越3 + "\n") +
                    ("3\u51F8 : " + 凸3 + "\n") +
                    '\n' +
                    '```\n';
                _b = "";
                return [4, lapAndBoss.CurrentMessage()];
            case 2: return [2, (_a +
                    (_b + (_c.sent())))];
        }
    });
}); };
