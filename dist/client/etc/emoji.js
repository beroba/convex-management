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
exports.Send = exports.React = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
exports.React = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (util.IsChannel(const_settings_1["default"].NOT_EMOJI_CHANNEL, msg.channel))
            return [2];
        yuiKusanoReact(msg);
        mazarashiReact(msg);
        usamaruReact(msg);
        macchaDesuyoReact(msg);
        nikuReact(msg);
        pantiesReact(msg);
        ringorouReact(msg);
        smicleReact(msg);
        ohayouReact(msg);
        oyasumiReact(msg);
        otukareReact(msg);
        chuukaReact(msg);
        return [2];
    });
}); };
var yuiKusanoReact = function (msg) {
    var match = msg.content.replace(/草|優衣|くさ$/g, 'ユイ').match(/ユイ/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.YUI_KUSANO);
    console.log('React Yui Kusano');
};
var mazarashiReact = function (msg) {
    var match = msg.content
        .replace(/ま.{1,3}らし|厚着|冷凍|解凍|玉子|オクトー|722547140487938181/g, 'だめらし')
        .match(/だめらし/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.MAZARASHI);
    console.log('React Mazarashi');
};
var usamaruReact = function (msg) {
    var match = msg.content
        .replace(/^うさ..|..まる$|兎丸|レジギガス|^レジ..|..ギガス$|ｷﾞｶﾞ|793515921128816670/g, 'うさまる')
        .match(/うさまる/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.USAMARU);
    console.log('React Usamaru');
};
var macchaDesuyoReact = function (msg) {
    var match = msg.content.replace(/抹茶|^まっちゃ/g, '利休').match(/利休/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.MACCHA_DESUYO);
    console.log('React Maccha Desuyo');
};
var nikuReact = function (msg) {
    var match = msg.content.match(/肉/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.NIKU);
    console.log('React Niku');
};
var pantiesReact = function (msg) {
    var match = msg.content.replace(/ぱんつ|パンツ|パンティ|下着/g, 'しろは').match(/しろは/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.PANTIES);
    console.log('React Panties');
};
var ringorouReact = function (msg) {
    var match = msg.content.replace(/んご|ンゴ|辻野|あかり|ﾝｺﾞ|林檎|あっぷる|アップル|apple/gi, 'んご').match(/んご/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.RINGOROU);
    console.log('React Ringorou');
};
var smicleReact = function (msg) {
    var match = msg.content.replace(/スマイル|smicle/gi, 'すまいる').match(/すまいる/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.SMICLE);
    console.log('React smicle');
};
var ohayouReact = function (msg) {
    var match = msg.content.replace(/ohayou/gi, 'おはよう').match(/おはよう/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.OHAYOU);
    console.log('React ohayou');
};
var oyasumiReact = function (msg) {
    var match = msg.content.replace(/oyasumi/gi, 'おやすみ').match(/おやすみ/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.OYASUMI);
    console.log('React oyasumi');
};
var otukareReact = function (msg) {
    var match = msg.content.replace(/otukare/gi, 'おつかれ').match(/おつかれ/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.OTUKARE);
    console.log('React otukare');
};
var chuukaReact = function (msg) {
    var match = msg.content.match(/中華/);
    if (!match)
        return;
    msg.react(const_settings_1["default"].EMOJI_ID.CHUUKA);
    console.log('React chuuka');
};
exports.Send = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
        if (util.IsChannel(const_settings_1["default"].NOT_EMOJI_CHANNEL, msg.channel))
            return [2];
        content = msg.content.replace(/るる/, 'ルル');
        if (content === 'ルル')
            return [2, ruruEmoji(msg)];
        content = msg.content.replace(/kmr/i, 'kmr');
        if (content === 'kmr')
            return [2, kmrEmoji(msg)];
        content = msg.content.replace(/あつもり/, '熱盛');
        if (content === '熱盛')
            return [2, atsumoriEmoji(msg)];
        content = msg.content.replace(/かちこみ|けんかか？|けんかか|ケンカか？|ケンカか|喧嘩か？/, '喧嘩か');
        if (content === '喧嘩か')
            return [2, kenkakaEmoji(msg)];
        content = msg.content;
        if (content === 'kusa')
            return [2, kusaEmoji(msg)];
        content = msg.content.replace(/ぱんつ|パンティ/, 'パンツ');
        if (content === 'パンツ')
            return [2, pantiesEmoji(msg)];
        content = msg.content;
        if (content === 'りんごろう')
            return [2, ringorouEmoji(msg)];
        content = msg.content.replace(/んも…|ンモ/, 'んも');
        if (content === 'んも')
            return [2, nmoEmoji(msg)];
        content = msg.content;
        if (content === '白鳥')
            return [2, shiratoriEmoji(msg)];
        content = msg.content;
        if (content === 'ア')
            return [2, aEmoji(msg)];
        return [2];
    });
}); };
var ruruEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.RURU)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send ruru Emoji"];
        }
    });
}); };
var kmrEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.KMR)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send kmr Emoji"];
        }
    });
}); };
var atsumoriEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.ATSUMORI)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send atsumori Emoji"];
        }
    });
}); };
var kenkakaEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.KENKAKA)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send kenkaka Emoji"];
        }
    });
}); };
var kusaEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.KUSA)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send kusa Emoji"];
        }
    });
}); };
var pantiesEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.PANTIES)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send panties Emoji"];
        }
    });
}); };
var ringorouEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.RINGOROU)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send ringorou Emoji"];
        }
    });
}); };
var nmoEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.NMO)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send nmo Emoji"];
        }
    });
}); };
var shiratoriEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.SHIRATORI)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send shiratori Emoji"];
        }
    });
}); };
var aEmoji = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, msg.channel.send(const_settings_1["default"].EMOJI_FULL_ID.A)];
            case 1:
                _a.sent();
                setTimeout(function () { return msg["delete"](); }, 100);
                return [2, util.GetUserName(msg.member) + " Send A Emoji"];
        }
    });
}); };
