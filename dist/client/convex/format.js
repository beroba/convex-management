"use strict";
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
exports.TL = void 0;
var moji_1 = __importDefault(require("moji"));
var TL = function (tl, time, msg) { return __awaiter(void 0, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
        content = new Generate(tl, time)
            .zenkakuToHankaku()
            .bracketSpaceAdjustment()
            .timeParser()
            .toCodeBlock()
            .alignVertically()
            .removeSomeSecond()
            .carryOverCalc()
            .toString();
        msg.reply(content);
        return [2];
    });
}); };
exports.TL = TL;
var Generate = (function () {
    function Generate(tl, time) {
        this.tl = tl;
        this.time = this.convertTime(time);
    }
    Generate.prototype.convertTime = function (time) {
        if (!time)
            return null;
        var t;
        if (/:/.test(time)) {
            var _a = __read(time.split(':').map(Number), 2), p = _a[0], q = _a[1];
            t = 90 - (p * 60 + q);
        }
        else {
            t = 90 - Number(time);
        }
        return t <= 0 ? null : t >= 91 ? 90 : t;
    };
    Generate.prototype.zenkakuToHankaku = function () {
        this.tl = moji_1["default"](this.tl).convert('ZE', 'HE').convert('ZS', 'HS').toString();
        return this;
    };
    Generate.prototype.bracketSpaceAdjustment = function () {
        this.tl = this.tl.replace(/ *\( */g, '(').replace(/ *\) */g, ')');
        this.tl = this.tl.replace(/\(/g, ' (').replace(/\)/g, ') ');
        return this;
    };
    Generate.prototype.timeParser = function () {
        this.tl = this.tl.replace(/\./g, ':');
        var tl = this.tl.split('');
        for (var i = 0; i < tl.length; i++) {
            if (!/\d/.test(tl[i]))
                continue;
            if (/:/.test(tl[i + 1])) {
                if (!/\d/.test(tl[i + 2]))
                    continue;
                if (/\d/.test(tl[i + 3])) {
                    if (!/\d/.test(tl[i + 4])) {
                        i += 3;
                        continue;
                    }
                    i = this.countUpToChar(tl, i + 4);
                }
                else {
                    i += 2;
                    tl[i] = "0" + tl[i];
                }
            }
            else if (/\d/.test(tl[i + 1])) {
                if (!/\d/.test(tl[i + 2])) {
                    tl[i] = "0:" + tl[i];
                    i++;
                    continue;
                }
                if (/\d/.test(tl[i + 3])) {
                    i = this.countUpToChar(tl, i + 3);
                }
                else {
                    if (/0|1/.test(tl[i])) {
                        tl[i] = tl[i] + ":";
                    }
                    i += 2;
                }
            }
            else {
                tl[i] = "0:0" + tl[i];
            }
        }
        this.tl = tl.join('');
        return this;
    };
    Generate.prototype.countUpToChar = function (tl, i) {
        for (; i < tl.length; i++) {
            if (!/\d/.test(tl[i]))
                break;
        }
        return i;
    };
    Generate.prototype.toCodeBlock = function () {
        if (!/\`\`\`/.test(this.tl)) {
            this.tl = "```\n" + this.tl + "```";
        }
        return this;
    };
    Generate.prototype.alignVertically = function () {
        this.tl = this.tl.replace(/\u200B/g, '').replace(/ +/g, ' ');
        this.tl = this.tl
            .split('\n')
            .map(function (l) {
            if (!/^\d/.test(l))
                return l;
            if (/ /.test(l[4]))
                return l;
            return l.slice(0, 4) + " " + l.slice(4);
        })
            .map(function (l) { return (/ /.test(l[0]) ? "    " + l : l); })
            .map(function (l) { return l.replace(/ +$/g, ''); })
            .join('\n');
        return this;
    };
    Generate.prototype.removeSomeSecond = function () {
        this.tl = this.tl
            .split('\n')
            .map(function (l, i, arr) {
            if (!i)
                return l;
            if (l.slice(0, 4) !== arr[i - 1].slice(0, 4))
                return l;
            return "    " + l.slice(4);
        })
            .join('\n');
        return this;
    };
    Generate.prototype.carryOverCalc = function () {
        var _a;
        if (!this.time)
            return this;
        var time = this.time;
        var list = (_a = this.tl.match(/\d:\d\d/g)) === null || _a === void 0 ? void 0 : _a.map(function (v) {
            var _a = __read(v.split(':').map(Number), 2), p = _a[0], q = _a[1];
            var t = p * 60 + q - time;
            return ((t / 60) | 0) + ":" + ((t % 60) + '').padStart(2, '0');
        });
        if (!list)
            return this;
        var times = this.order(list);
        this.tl = this.tl
            .replace(/\d:\d\d/g, '１')
            .split('')
            .map(function (tl) { return (/１/.test(tl) ? times.pop() : tl); })
            .join('');
        var tl = this.tl.split('\n');
        var i = tl.findIndex(function (v) { return /0:00|0:-/.test(v); });
        if (i === -1)
            return this;
        this.tl = tl.slice(0, i).join('\n') + '```';
        return this;
    };
    Generate.prototype.order = function (list) {
        var Order = (function () {
            function Order(list) {
                this.list = list;
                this.count = 0;
            }
            Order.prototype.pop = function () {
                return this.list[this.count++];
            };
            return Order;
        }());
        return new Order(list);
    };
    Generate.prototype.toString = function () {
        return this.tl;
    };
    return Generate;
}());
