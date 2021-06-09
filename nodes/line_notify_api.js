"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const nodeInit = (RED) => {
    const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";
    const UN_KNOWN_VALUE = -1;
    function lineNotifyApiConstructor(config) {
        var _a, _b;
        RED.nodes.createNode(this, config);
        let node = this;
        try {
            node.accessToken = config.accessToken;
            if (node.accessToken.length > 0) {
                node.status({ fill: "blue", shape: "dot", text: "resources.message.ready" });
            }
            else {
                node.status({ fill: "red", shape: "ring", text: "resources.message.tokenError" });
            }
            node.stickerPackageId = (_a = config === null || config === void 0 ? void 0 : config.stickerPackageId) !== null && _a !== void 0 ? _a : UN_KNOWN_VALUE;
            node.stickerId = (_b = config === null || config === void 0 ? void 0 : config.stickerId) !== null && _b !== void 0 ? _b : UN_KNOWN_VALUE;
        }
        catch (error) {
            node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            node.error(error);
        }
        node.on('input', async (msg) => {
            var _a;
            try {
                let reqQueryPram = {
                    message: "",
                    notificationDisabled: false
                };
                // Required
                reqQueryPram.message = (_a = msg === null || msg === void 0 ? void 0 : msg.message) !== null && _a !== void 0 ? _a : msg.payload;
                // Optional: sticker
                if ((msg === null || msg === void 0 ? void 0 : msg.hasOwnProperty('stickerPackageId')) && (msg === null || msg === void 0 ? void 0 : msg.hasOwnProperty('stickerId'))) {
                    reqQueryPram.stickerPackageId = msg === null || msg === void 0 ? void 0 : msg.stickerPackageId;
                    reqQueryPram.stickerId = msg === null || msg === void 0 ? void 0 : msg.stickerId;
                }
                else if (UN_KNOWN_VALUE !== node.stickerPackageId && UN_KNOWN_VALUE !== node.stickerId) {
                    reqQueryPram.stickerPackageId = node.stickerPackageId;
                    reqQueryPram.stickerId = node.stickerId;
                }
                msg.payload = {};
                if (node.accessToken.length > 0) {
                    const lineNotifyConfig = {
                        url: LINE_NOTIFY_API,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + node.accessToken
                        },
                        data: querystring_1.default.stringify(reqQueryPram)
                    };
                    const responseLINENotify = await axios_1.default.request(lineNotifyConfig);
                    if (200 === responseLINENotify.status) {
                        msg.payload = responseLINENotify.data;
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete" });
                    }
                    else {
                        msg.payload = responseLINENotify.statusText;
                        node.status({ fill: "green", shape: "dot", text: responseLINENotify.statusText });
                    }
                }
                else {
                    node.status({ fill: "red", shape: "ring", text: "resources.message.tokenError" });
                }
            }
            catch (error) {
                node.status({ fill: "red", shape: "ring", text: "resources.message.communicationError" });
                node.error(error);
                msg.payload = {};
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType('line_notify_api', lineNotifyApiConstructor);
};
module.exports = nodeInit;
//# sourceMappingURL=line_notify_api.js.map