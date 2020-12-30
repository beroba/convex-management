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
exports.SendEmoji = exports.YabaiImage = exports.GoodMorning = exports.AorB = exports.Speak = exports.Emoji = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
exports.Emoji = function (msg) {
    if (util.IsChannel(const_settings_1["default"].NOT_EMOJI_CHANNEL, msg.channel))
        return;
    yuiKusanoEmoji(msg);
    mazarashiEmoji(msg);
    usamaruEmoji(msg);
    macchaDesuyoEmoji(msg);
    nikuEmoji(msg);
};
var yuiKusanoEmoji = function (msg) {
    var match = msg.content.replace(/草|優衣|くさ$/g, 'ユイ').match(/ユイ/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.YUI_KUSANO);
    console.log('React Yui Kusano emoji');
};
var mazarashiEmoji = function (msg) {
    var match = msg.content.replace(/ま.+らし|厚着|下着|冷凍|解凍|722547140487938181/g, 'まらざし').match(/まらざし/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.MAZARASHI);
    console.log('React Mazarashi emoji');
};
var usamaruEmoji = function (msg) {
    var match = msg.content
        .replace(/^うさ..|..まる$|兎丸|レジギガス|^レジ...|..ギガス$|ｷﾞｶﾞ|652747597739589632/g, 'うさまる')
        .match(/うさまる/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.USAMARU);
    console.log('React Usamaru emoji');
};
var macchaDesuyoEmoji = function (msg) {
    var match = msg.content.replace(/抹茶|^まっちゃ/g, '利休').match(/利休/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.MACCHA_DESUYO);
    console.log('React Maccha Desuyo emoji');
};
var nikuEmoji = function (msg) {
    var match = msg.content.match(/肉/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.NIKU);
    console.log('React Niku emoji');
};
exports.Speak = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var adjustment, match, content, channel;
    return __generator(this, function (_a) {
        if (msg.author.bot)
            return [2];
        if (!util.IsChannel(const_settings_1["default"].THIS_AND_THAT_CHANNEL, msg.channel))
            return [2];
        adjustment = msg.content.replace(/お話し|お話/, 'おはなし');
        match = adjustment.match(/^おはなし /);
        if (!match)
            return [2];
        setTimeout(function () { return msg["delete"](); }, 500);
        content = adjustment.replace('おはなし ', '');
        channel = util.GetTextChannel(msg.channel.id);
        channel.send(content);
        console.log(util.GetUserName(msg.member) + ", " + content);
        return [2, 'Speaking Cal'];
    });
}); };
exports.AorB = function (msg) {
    var _a;
    if (msg.author.bot)
        return;
    if (!util.IsChannel(const_settings_1["default"].THIS_AND_THAT_CHANNEL, msg.channel))
        return;
    if (msg.content.match(/https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/))
        return;
    var content = util.Format(msg.content);
    var emoji = (_a = content.match(/<.*?>/g)) === null || _a === void 0 ? void 0 : _a.map(function (e) { return e; });
    var line = content
        .replace(/<.*?>/g, '１')
        .split('\n')
        .find(function (s) { return /^.+(?<![dis][cord])or.+$/i.test(s); });
    if (!line)
        return;
    var list = replaceEmoji(line.split(/(?<![dis][cord])or/i).map(function (s) { return s.trim(); }), emoji);
    var rand = createRandNumber(list.length);
    msg.reply(list[rand]);
    console.log(util.GetUserName(msg.member) + ", " + content);
    return 'Returned any of or';
};
var replaceEmoji = function (list, emoji) {
    if (!emoji)
        return list;
    var i = 0;
    return list.map(function (l) {
        for (var j = 0; j < 20; j++) {
            if (!/１/.test(l))
                return l;
            l = l.replace('１', emoji[i++]);
        }
        return l;
    });
};
var createRandNumber = function (n) { return require('get-random-values')(new Uint8Array(1))[0] % n; };
exports.GoodMorning = function (msg) {
    if (msg.author.bot)
        return;
    if (!util.IsChannel(const_settings_1["default"].THIS_AND_THAT_CHANNEL, msg.channel))
        return;
    if (!msg.content.match(/カンカンカン/))
        return;
    var message = 'おはよー！！！カンカンカン！！！起きなさい！！！クラバトよ！！！！すごいクラバトよ！！！！外が明るいわよ！！カンカンカンカンカン！！！！！おはよ！！カンカンカン！！！見て見て！！！！外明るいの！！！外！！！！見て！！カンカンカンカンカン！！凸しなさい！！早く凸して！！カンカン！ぶっ殺すわよ！！！！！！！！！！';
    var channel = util.GetTextChannel(msg.channel.id);
    channel.send(message);
    return 'Good morning';
};
exports.YabaiImage = function (msg) {
    if (!util.IsChannel(const_settings_1["default"].THIS_AND_THAT_CHANNEL, msg.channel))
        return;
    var match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/);
    if (!match)
        return;
    msg.channel.send('', { files: [const_settings_1["default"].URL.YABAIWAYO] });
    return 'Send Yabai Image';
};
exports.SendEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(msg.content === 'ルル')) return [3, 2];
                return [4, msg.channel.send('<:8_:661486876246540298>')];
            case 1:
                _a.sent();
                msg["delete"]();
                return [2, 'Send Ruru Emoji'];
            case 2:
                if (!(msg.content === 'kmr')) return [3, 4];
                return [4, msg.channel.send('<:emoji_39:618400519488143360>')];
            case 3:
                _a.sent();
                msg["delete"]();
                return [2, 'Send kmr Emoji'];
            case 4: return [2];
        }
    });
}); };
