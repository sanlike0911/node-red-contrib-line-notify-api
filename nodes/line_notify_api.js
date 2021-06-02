"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const nodeInit = (RED) => {
    const LINE_NOTIFY_API = "https://notify-api.line.me/api/notify";
    function lineNotifyApiConstructor(config) {
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
        }
        catch (error) {
            node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            node.error(error);
        }
        node.on('input', async (msg) => {
            try {
                const message = msg.payload;
                msg.payload = {};
                if (node.accessToken.length > 0) {
                    const lineNotifyConfig = {
                        url: LINE_NOTIFY_API,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + node.accessToken
                        },
                        data: querystring_1.default.stringify({
                            message: message,
                        })
                    };
                    const responseLINENotify = await axios_1.default.request(lineNotifyConfig);
                    if (200 === responseLINENotify.status) {
                        msg.payload = responseLINENotify.data;
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete" });
                    }
                    else {
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