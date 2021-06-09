import { NodeInitializer } from "node-red";
import lineNotifyApi from "./type";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "querystring";

const nodeInit: NodeInitializer = (RED): void => {

    const LINE_NOTIFY_API: string = "https://notify-api.line.me/api/notify";

    const UN_KNOWN_VALUE: number = -1;

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
            node.stickerPackageId = config?.stickerPackageId ?? UN_KNOWN_VALUE;
            node.stickerId = config?.stickerId ?? UN_KNOWN_VALUE;
        } catch (error) {
            node.status({fill:"red", shape:"ring", text:"resources.message.error"});
            node.error(error);
        }

        node.on('input', async (msg: any) => {
            try {
                let reqQueryPram: qs.ParsedUrlQueryInput  = {
                    message: "",
                    notificationDisabled: false
                };
                // Required
                reqQueryPram.message = msg?.message ?? msg.payload;

                // Optional: sticker
                if( msg?.hasOwnProperty('stickerPackageId') && msg?.hasOwnProperty('stickerId') ) {
                    reqQueryPram.stickerPackageId = msg?.stickerPackageId;
                    reqQueryPram.stickerId = msg?.stickerId;
                } else if( UN_KNOWN_VALUE !== node.stickerPackageId && UN_KNOWN_VALUE !== node.stickerId ) {
                    reqQueryPram.stickerPackageId = node.stickerPackageId;
                    reqQueryPram.stickerId = node.stickerId;
                }

                msg.payload = {};

                if(node.accessToken.length > 0){
                    const lineNotifyConfig: AxiosRequestConfig = {
                        url: LINE_NOTIFY_API,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Bearer ' + node.accessToken
                        },
                        data: qs.stringify(reqQueryPram)
                    }
                    const responseLINENotify: AxiosResponse<any> = await axios.request(lineNotifyConfig);
                    if(200 === responseLINENotify.status){
                        msg.payload = responseLINENotify.data;
                        node.status({fill:"green", shape:"dot", text:"resources.message.complete"});    
                    } else {
                        msg.payload = responseLINENotify.statusText;
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
