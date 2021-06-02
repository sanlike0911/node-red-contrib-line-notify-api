import { NodeInitializer } from "node-red";
import { lineNotifyApi } from "./line_notify_api.d";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "querystring";

const nodeInit: NodeInitializer = (RED): void => {

    const LINE_NOTIFY_API: string = "https://notify-api.line.me/api/notify";

    function lineNotifyApiConstructor(
        this: lineNotifyApi.lineNotifyApiNode,
        config: lineNotifyApi.lineNotifyApiDef
    ): void {
        RED.nodes.createNode(this, config);
        let node: lineNotifyApi.lineNotifyApiNode = this;

        try {
            node.accessToken = config.accessToken;
            if(node.accessToken.length > 0){
                node.status({fill:"blue", shape:"dot", text:"resources.message.ready"});
            } else {
                node.status({fill:"red", shape:"ring", text:"resources.message.tokenError"});
            }
        } catch (error) {
            node.status({fill:"red", shape:"ring", text:"resources.message.error"});
            node.error(error);
        }

        node.on('input', async (msg: lineNotifyApi.nodeRedMsgBase) => {
            try {
                const message: string = msg.payload;
                msg.payload = {};
                if(node.accessToken.length > 0){
                    const lineNotifyConfig: AxiosRequestConfig = {
                        url: LINE_NOTIFY_API,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + node.accessToken
                        },
                        data: qs.stringify({
                            message: message,
                        })
                    }
                    const responseLINENotify: AxiosResponse<any> = await axios.request(lineNotifyConfig);
                    if(200 === responseLINENotify.status){
                        msg.payload = responseLINENotify.data;
                        node.status({fill:"green", shape:"dot", text:"resources.message.complete"});    
                    } else {
                        node.status({fill:"green", shape:"dot", text:responseLINENotify.statusText});    
                    }
                } else {
                    node.status({fill:"red", shape:"ring", text:"resources.message.tokenError"});
                }
            } catch (error) {
                node.status({fill:"red", shape:"ring", text:"resources.message.communicationError"});
                node.error(error);
                msg.payload = {};
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType('line_notify_api', lineNotifyApiConstructor);
};

export = nodeInit;
