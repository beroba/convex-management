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
exports.YabaiImage = exports.AorB = exports.Speak = exports.Emoji = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
exports.Emoji = function (msg) {
    yuiKusano(msg);
    mazarashi(msg);
    usamaru(msg);
};
var yuiKusano = function (msg) {
    var match = msg.content.replace(/草|優衣|くさ|ゆい|715020255059247146/g, 'ユイ').match(/ユイ/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.YUI_KUSANO);
    console.log('React Yui Kusano');
};
var mazarashi = function (msg) {
    var match = msg.content.replace(/まざ|厚着|下着|冷凍|341239349997993984|722547140487938181/g, 'らし').match(/らし/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.MAZARASHI);
    console.log('React Mazarashi');
};
var usamaru = function (msg) {
    var match = msg.content.replace(/うさ|レジ|ギガス|ｷﾞｶﾞ|兎丸|usamaru|652747597739589632/g, 'まる').match(/まる/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.USAMARU);
    console.log('React Usamaru');
};
exports.Speak = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var adjustment, match, content, channel;
    return __generator(this, function (_a) {
        if (msg.author.bot)
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
    if (msg.author.bot)
        return;
    if (!util.IsChannel(const_settings_1["default"].SEND_IMAGE_CHANNEL, msg.channel))
        return;
    var content = msg.content.split('\n').find(function (s) { return /^.+or.+$/i.test(s); });
    if (!content)
        return;
    var list = content
        .replace('OR', 'or')
        .split('or')
        .map(function (s) { return s.trim(); });
    var rand = createRandNumber(list.length);
    var channel = util.GetTextChannel(msg.channel.id);
    channel.send(list[rand]);
    console.log(util.GetUserName(msg.member) + ", " + content);
    return 'Returned any of or';
};
var createRandNumber = function (n) { return require('get-random-values')(new Uint8Array(1))[0] % n; };
exports.YabaiImage = function (msg) {
    if (!util.IsChannel(const_settings_1["default"].SEND_IMAGE_CHANNEL, msg.channel))
        return;
    var match = msg.content.replace(/やばい|ヤバい/g, 'ヤバイ').match(/ヤバイ/);
    if (!match)
        return;
    msg.channel.send('', { files: [const_settings_1["default"].URL.YABAIWAYO] });
    return 'Send Yabai Image';
};
