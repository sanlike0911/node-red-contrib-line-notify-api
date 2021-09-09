import { Node, NodeDef } from "node-red";

declare namespace lineNotifyApi {

    interface configBase {

        accessToken: string;

        stickerPackageId: number;

        stickerId: number;

    }
    interface requestQueryParameters {

        // 1000 characters max
        message: string;
        // Maximum size of 240×240px JPEG
        imageThumbnail?: string;
        // Maximum size of 2048×2048px JPEG
        imageFullsize?: string;
        // Upload a image file to the LINE server.
        // Supported image format is png and jpeg.
        // If you specified imageThumbnail ,imageFullsize and imageFile, imageFile takes precedence.
        // There is a limit that you can upload to within one hour.
        // For more information, please see the section of the API Rate Limit.
        imageFile?: File;
        // Package ID.
        // https://developers.line.biz/en/docs/messaging-api/sticker-list/
        stickerPackageId?: number;
        // Sticker ID.
        stickerId?: number;
        // true: The user doesn't receive a push notification when the message is sent.
        // false: The user receives a push notification when the message is sent (unless they have disabled push notification in LINE and/or their device).
        // If omitted, the value defaults to false.
        notificationDisabled?: boolean;

    }

    interface nodeRedMsgBase {

        _msgid?: string;

        payload: any;

        topic?: string;
    }

    interface inputMessage extends nodeRedMsgBase, requestQueryParameters {}
    interface lineNotifyApiDef extends NodeDef, configBase {}
    interface lineNotifyApiNode extends Node, configBase {}
}

export default lineNotifyApi; 