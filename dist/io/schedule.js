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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.FetchBoss = exports.Fetch = exports.Edit = exports.AllDelete = exports.Delete = exports.Add = exports.Update = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var pieces_each_1 = __importDefault(require("pieces-each"));
var util = __importStar(require("../util"));
var io = __importStar(require("."));
var Update = function (plans) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        pieces_each_1["default"](plans, 8).forEach(function (p, i) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS[i], p)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        return [2];
    });
}); };
exports.Update = Update;
var Add = function (plan) { return __awaiter(void 0, void 0, void 0, function () {
    var plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                plans.push(plan);
                return [4, exports.Update(plans)];
            case 2:
                _a.sent();
                return [2, plans];
        }
    });
}); };
exports.Add = Add;
var Delete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var plans, plan;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                plan = plans.find(function (p) { return p.senderID === id; });
                if (!plan)
                    return [2, [plans, null]];
                plans = plans.filter(function (p) { return p.senderID !== id; });
                if (!(plans.length % 8 === 0)) return [3, 4];
                return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS[(plans.length / 8) | 0], [])];
            case 2:
                _a.sent();
                return [4, util.Sleep(100)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4, exports.Update(plans)];
            case 5:
                _a.sent();
                return [2, [plans, plan]];
        }
    });
}); };
exports.Delete = Delete;
var AllDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Promise.all(util
                    .range(const_settings_1["default"].CAL_STATUS_ID.PLANS.length)
                    .map(function (i) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, io.UpdateArray(const_settings_1["default"].CAL_STATUS_ID.PLANS[i], [])];
                        case 1: return [2, _a.sent()];
                    }
                }); }); }))];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
exports.AllDelete = AllDelete;
var Edit = function (text, id) { return __awaiter(void 0, void 0, void 0, function () {
    var plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                plans = plans.map(function (p) {
                    if (p.senderID !== id)
                        return p;
                    p.msg = text;
                    return p;
                });
                return [4, exports.Update(plans)];
            case 2:
                _a.sent();
                return [2, plans];
        }
    });
}); };
exports.Edit = Edit;
var Fetch = function () { return __awaiter(void 0, void 0, void 0, function () {
    var plans, range, range_1, range_1_1, i, p, e_1_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                plans = [];
                range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                range_1 = __values(range), range_1_1 = range_1.next();
                _b.label = 2;
            case 2:
                if (!!range_1_1.done) return [3, 5];
                i = range_1_1.value;
                return [4, io.Fetch(const_settings_1["default"].CAL_STATUS_ID.PLANS[i])];
            case 3:
                p = _b.sent();
                plans = plans.concat(p);
                if (p.length < 8)
                    return [3, 5];
                _b.label = 4;
            case 4:
                range_1_1 = range_1.next();
                return [3, 2];
            case 5: return [3, 8];
            case 6:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3, 8];
            case 7:
                try {
                    if (range_1_1 && !range_1_1.done && (_a = range_1["return"])) _a.call(range_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7];
            case 8: return [2, plans];
        }
    });
}); };
exports.Fetch = Fetch;
var FetchBoss = function (alpha) { return __awaiter(void 0, void 0, void 0, function () {
    var plans;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, exports.Fetch()];
            case 1:
                plans = _a.sent();
                return [2, plans.filter(function (p) { return p.alpha === alpha; })];
        }
    });
}); };
exports.FetchBoss = FetchBoss;
