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
exports.PlanOnly = exports.SituationEdit = exports.AllOutput = exports.Output = void 0;
var alphabet_to_number_1 = require("alphabet-to-number");
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var bossTable = __importStar(require("../../io/bossTable"));
var current = __importStar(require("../../io/current"));
var util = __importStar(require("../../util"));
var spreadsheet = __importStar(require("../../util/spreadsheet"));
exports.Output = function (alpha) { return __awaiter(void 0, void 0, void 0, function () {
    var list, name, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, readPlanList()];
            case 1:
                list = _a.sent();
                return [4, bossTable.TakeName(alpha)];
            case 2:
                name = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(name + "\n" + '```\n' + (createPlanList(alpha, list) + "\n") + '```');
                return [2];
        }
    });
}); };
exports.AllOutput = function () { return __awaiter(void 0, void 0, void 0, function () {
    var text, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, createAllPlanText()];
            case 1:
                text = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send(text);
                return [2];
        }
    });
}); };
exports.SituationEdit = function () { return __awaiter(void 0, void 0, void 0, function () {
    var text, situation, msg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, createAllPlanText()];
            case 1:
                text = _a.sent();
                situation = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.CONVEX_SITUATION);
                return [4, situation.messages.fetch(const_settings_1["default"].CONVEX_MESSAGE_ID.PLAN)];
            case 2:
                msg = _a.sent();
                msg.edit(text);
                console.log('Edit the convex schedule of the convex situation');
                return [2];
        }
    });
}); };
var createAllPlanText = function () { return __awaiter(void 0, void 0, void 0, function () {
    var list, state, planTexts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, readPlanList()];
            case 1:
                list = _a.sent();
                return [4, current.Fetch()];
            case 2:
                state = _a.sent();
                return [4, Promise.all(Array.from(Array(5), function (_, i) { return i; }).map(function (i) { return __awaiter(void 0, void 0, void 0, function () {
                        var alpha, name, hp;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    alpha = alphabet_to_number_1.NtoA(i + 1);
                                    return [4, bossTable.TakeName(alpha)];
                                case 1:
                                    name = _a.sent();
                                    hp = const_settings_1["default"].STAGE_HP[state.stage][alpha];
                                    return [2, name + " `" + hp + "`\n" + '```\n' + (createPlanList(alpha, list) + "\n") + '```'];
                            }
                        });
                    }); }))];
            case 3:
                planTexts = _a.sent();
                return [2, planTexts.join('')];
        }
    });
}); };
exports.PlanOnly = function (num) { return __awaiter(void 0, void 0, void 0, function () {
    var list, channel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, readPlanList()];
            case 1:
                list = _a.sent();
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PROGRESS);
                channel.send('```\n' + (createPlanList(num, list) + "\n") + '```');
                return [2];
        }
    });
}); };
var readPlanList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, cells;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, spreadsheet.GetWorksheet(const_settings_1["default"].PLAN_SHEET.SHEET_NAME)];
            case 1:
                sheet = _a.sent();
                return [4, spreadsheet.GetCells(sheet, const_settings_1["default"].PLAN_SHEET.PLAN_CELLS)];
            case 2:
                cells = _a.sent();
                return [2, pieces_each_1["default"](cells, 9)
                        .filter(util.Omit)
                        .filter(function (v) { return !v[0]; })];
        }
    });
}); };
var createPlanList = function (num, list) {
    var text = list
        .filter(function (l) { return l[5] === num; })
        .map(function (l) { return l[3] + " " + l[7]; })
        .join('\n');
    return text ? text : ' ';
};
