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
exports.ConvexReport = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
exports.ConvexReport = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.username) === 'キャル')
                    return [2];
                if (msg.channel.id !== const_settings_1["default"].CONVEX_CHANNEL.REPORT_ID)
                    return [2];
                return [4, getDateColumn()];
            case 1:
                day = _b.sent();
                if (!day) {
                    msg.reply('今日はクラバトの日じゃないわ');
                    return [2, "It's not ClanBattle days"];
                }
                switch (true) {
                    case /1|2|3/.test(msg.content.charAt(0)): {
                        updateStatus(msg);
                        return [2, 'Update status'];
                    }
                    default: {
                        msg.reply('形式が違うわ、やりなおし！');
                        return [2, 'Different format'];
                    }
                }
                return [2];
        }
    });
}); };
var getDateColumn = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mmdd, infoSheet, cells, cell;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mmdd = function () { return (function (d) { return d.getMonth() + 1 + "/" + d.getDate(); })(new Date()); };
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].INFORMATION_SHEET.SHEET_NAME)];
            case 1:
                infoSheet = _a.sent();
                return [4, spreadsheet.GetCells(infoSheet, const_settings_1["default"].INFORMATION_SHEET.DATE_CELLS)];
            case 2:
                cells = _a.sent();
                cell = util
                    .PiecesEach(cells, 2)
                    .map(function (v) { return [v[0].split('/').map(Number).join('/'), v[1]]; })
                    .filter(function (v) { return v[0] === mmdd(); })[0];
                return [2, cell ? cell[1] : null];
        }
    });
}); };
var updateStatus = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var old;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, cellUpdate(msg.content, msg)];
            case 1:
                old = _a.sent();
                reaction(old, msg);
                if (msg.content === '3') {
                    msg.reply('n人目の3凸終了者よ！');
                }
                return [2];
        }
    });
}); };
var cellUpdate = function (val, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var user, manageSheet, cells, cell, _a, _b, _c, old;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                user = ((_d = msg.member) === null || _d === void 0 ? void 0 : _d.nickname) ? (_e = msg.member) === null || _e === void 0 ? void 0 : _e.nickname : ((_f = msg.member) === null || _f === void 0 ? void 0 : _f.user.username) || '';
                return [4, spreadsheet.GetWorksheet(const_settings_1["default"].MANAGEMENT_SHEET.SHEET_NAME)];
            case 1:
                manageSheet = _g.sent();
                return [4, spreadsheet.GetCells(manageSheet, const_settings_1["default"].MANAGEMENT_SHEET.MEMBER_CELLS)];
            case 2:
                cells = _g.sent();
                _b = (_a = manageSheet).getCell;
                _c = "";
                return [4, getDateColumn()];
            case 3: return [4, _b.apply(_a, [_c + (_g.sent()) + (cells.indexOf(user) + 2)])];
            case 4:
                cell = _g.sent();
                return [4, cell.getValue()];
            case 5:
                old = _g.sent();
                return [4, cell.setValue(val)];
            case 6:
                _g.sent();
                return [2, old];
        }
    });
}); };
var reaction = function (old, msg) {
    msg.react(const_settings_1["default"].EMOJI_ID.KAKUNIN);
    msg.react('❌');
    msg.awaitReactions(function (react, user) {
        if (user.id !== msg.author.id || react.emoji.name !== '❌')
            return false;
        (function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, cellUpdate(old, msg)];
                case 1: return [2, _a.sent()];
            }
        }); }); })();
        console.log(old);
        msg.reply('取り消したわ');
        console.log('Convex cancel');
        return true;
    });
};
