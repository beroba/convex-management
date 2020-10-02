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
exports.Save = exports.RoleGrant = void 0;
var moji_1 = __importDefault(require("moji"));
var const_settings_1 = __importDefault(require("const-settings"));
var util = __importStar(require("../../util"));
exports.RoleGrant = function (react, user) {
    var _a;
    if (react.message.channel.id !== const_settings_1["default"].CHANNEL_ID.PLAYER_ID_ROLE_GRANT)
        return;
    var member = util.GetMembersFromUser((_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.members, user);
    member === null || member === void 0 ? void 0 : member.roles.add(const_settings_1["default"].ROLE_ID.PLAYER_ID_SEND);
    return 'Grant player id send role';
};
exports.Save = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var url, channel, content;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if ((_a = msg.member) === null || _a === void 0 ? void 0 : _a.user.bot)
                    return [2];
                if (msg.channel.id !== const_settings_1["default"].CHANNEL_ID.PLAYER_ID_SEND)
                    return [2];
                return [4, ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.roles.remove(const_settings_1["default"].ROLE_ID.PLAYER_ID_SEND))];
            case 1:
                _c.sent();
                url = msg.attachments.map(function (a) { return a.url; })[0];
                channel = util.GetTextChannel(const_settings_1["default"].CHANNEL_ID.PLAYER_ID_LIST);
                content = moji_1["default"](msg.content).convert('ZE', 'HE').convert('ZS', 'HS').toString();
                return [4, channel.send(util.GetUserName(msg.member) + "\n" + content, url ? { files: [url] } : {})];
            case 2:
                _c.sent();
                return [4, msg["delete"]()];
            case 3:
                _c.sent();
                return [2, 'Save player id'];
        }
    });
}); };
