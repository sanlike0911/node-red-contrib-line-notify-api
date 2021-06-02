import { Node, NodeDef } from "node-red";

declare namespace lineNotifyApi {

    interface configBase {
        accessToken: string;
    }

    interface nodeRedMsgBase {
        _msgid?: string;
        payload?: any;
        topic?: string;
    }
    interface lineNotifyApiDef extends NodeDef, configBase {}
    interface lineNotifyApiNode extends Node, configBase {}
}