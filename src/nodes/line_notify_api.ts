import { NodeInitializer } from "node-red";
import lineNotifyApi from "./type";
import { Buffer } from 'buffer';
import FormData from 'form-data';

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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
                let formData = new FormData();

                // Required
                formData.append('message', msg?.message ?? msg.payload);

                // Optional: sticker
                if( msg?.hasOwnProperty('stickerPackageId') && msg?.hasOwnProperty('stickerId') ) {
                    formData.append('stickerPackageId', msg?.stickerPackageId);
                    formData.append('stickerId', msg?.stickerId);
                } else if( UN_KNOWN_VALUE !== node.stickerPackageId && UN_KNOWN_VALUE !== node.stickerId ) {
                    formData.append('stickerPackageId', node?.stickerPackageId);
                    formData.append('stickerId', node?.stickerId);
                }

                // Optional: image
                if( msg?.hasOwnProperty('imageBase64') && msg?.hasOwnProperty('imageFileName') ) {
                    const _bf = Buffer.from(msg?.imageBase64, "base64");
                    formData.append('imageFile', _bf, msg?.imageFileName);
                }

                msg.payload = {};

                if(node.accessToken.length > 0){
                    const lineNotifyConfig: AxiosRequestConfig = {
                        url: LINE_NOTIFY_API,
                        method: 'post',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + node.accessToken
                        },
                        data: formData
                    }
                    // console.log(lineNotifyConfig);

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
