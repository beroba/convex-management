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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Ready = void 0;
var const_settings_1 = __importDefault(require("const-settings"));
var index_1 = require("../index");
var util = __importStar(require("../util"));
exports.Ready = function () {
    var _a;
    var channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.BOT_NOTIFY);
    channel.send('きゃるきゃるーん');
    var c = util.GetTextChannel('745817773552304159');
    c.send('**プロフィール**の**スクショ**をこのチャンネルに送信して下さい。\n' +
        'このチャンネルはメッセージを一度送信すると閲覧できなくなります（別のチャンネルに移るまで一時的に見えます）。\n' +
        '間違えた場合、もう一度**id送信チャンネル**でリアクションをして下さい。');
    console.log("Logged in as " + ((_a = index_1.Client.user) === null || _a === void 0 ? void 0 : _a.username) + "!");
};
