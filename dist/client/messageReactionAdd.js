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
exports.MessageReactionAdd = void 0;
var throw_env_1 = __importDefault(require("throw-env"));
var playerID = __importStar(require("./etc/playerID"));
exports.MessageReactionAdd = function (react, user) {
    var _a;
    if (((_a = react.message.guild) === null || _a === void 0 ? void 0 : _a.id) !== throw_env_1["default"]('CLAN_SERVER_ID'))
        return;
    var comment;
    comment = playerID.RoleGrant(react, user);
    if (comment)
        return console.log(comment);
};
