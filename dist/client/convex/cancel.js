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
exports.Cancel = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
var util = __importStar(require("../../util"));
var date = __importStar(require("./date"));
var lapAndBoss = __importStar(require("./lapAndBoss"));
var situation = __importStar(require("./situation"));
var status = __importStar(require("./status"));
exports.Cancel = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var channel, day;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (user.bot)
                    return [2];
                if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.CONVEX_REPORT)
                    return [2];
                if (react.emoji.id !== const_settings_1["default"].EMOJI_ID.TORIKESHI)
                    return [2];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_REPORT);
                return [4, channel.messages.fetch(react.message.id)];
            case 1:
                _a.sent();
                if (react.message.author.id !== user.id)
                    return [2];
                return [4, date.GetDay()];
            case 2:
                day = _a.sent();
                if (!day)
                    return [2];
                return [4, statusRestore(react, user)];
            case 3:
                _a.sent();
                situation.Report();
                return [2, 'Convex cancellation'];
        }
    });
}); };
var statusRestore = function (react, user) { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, members, member, row, days, num_cell, over_cell, end_cell, hist_cell;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                sheet = _b.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                members = (_b.sent()).filter(function (v) { return v; });
                member = util.GetMembersFromUser((_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.members, user);
                row = status.GetMemberRow(members, member);
                return [4, date.CheckCalnBattle()];
            case 3:
                days = _b.sent();
                return [4, status.GetCell(0, row, sheet, days)];
            case 4:
                num_cell = _b.sent();
                return [4, status.GetCell(1, row, sheet, days)];
            case 5:
                over_cell = _b.sent();
                return [4, status.GetCell(2, row, sheet, days)];
            case 6:
                end_cell = _b.sent();
                return [4, status.GetCell(3, row, sheet, days)];
            case 7:
                hist_cell = _b.sent();
                rollback(num_cell, over_cell, hist_cell);
                endConfirm(end_cell, member);
                feedback(num_cell, over_cell, user);
                killConfirm(react);
                return [2];
        }
    });
}); };
var rollback = function (num_cell, over_cell, hist_cell) {
    var hist = hist_cell.getValue().split(',');
    num_cell.setValue(hist[0]);
    over_cell.setValue(hist[1]);
};
var endConfirm = function (end_cell, member) {
    var end = end_cell.getValue();
    if (!end)
        return;
    end_cell.setValue();
    member === null || member === void 0 ? void 0 : member.roles.add(const_settings_1["default"].ROLE_ID.REMAIN_CONVEX);
};
var feedback = function (num_cell, over_cell, user) {
    var num = Number(num_cell.getValue());
    var over = over_cell.getValue();
    var channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_REPORT);
    channel.send("\u53D6\u6D88\u3092\u884C\u3063\u305F\u308F\u3088\n<@!" + user.id + ">, " + (num ? num + "\u51F8\u76EE " + (over ? '持ち越し' : '終了') : '未凸'));
};
var killConfirm = function (react) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!/^(k|ｋ)/i.test(react.message.content))
            return [2];
        lapAndBoss.Previous();
        return [2];
    });
}); };
