# node-red-contrib-line-notify-api

A Node-RED node for sending to line notifications.

![line_notify_api](./figs/sample00.png)

## Pre-requisites

The node-red-contrib-line-notify-api requires `Node-RED 1.00` to be installed.

## Install

```cmd
npm install node-red-contrib-line-notify-api
```

## Usage

- Input

    The line notification message is passed by msg.payload.

    ```json
    msg.payload = "line notification message."
    ```

- Output

    The processing result is passed by msg.payload. It consists of an object that contains the following properties:

    ```javascript
    export interface AxiosResponse<T = any>  {
        data: T;
        status: number;
        statusText: string;
        headers: any;
        config: AxiosRequestConfig;
        request?: any;
    }
    ```

    msg.payload : Object

    ```cmd
    {"status":200,"message":"ok"}
    ```

- example

    ```json
    [
        {
            "id": "dd7244fa.c89398",
            "type": "line_notify_api",
            "z": "fa43d1e2.b1c88",
            "name": "",
            "accessToken": "",
            "x": 330,
            "y": 60,
            "wires": [
                [
                    "3a9c0b5c.327804"
                ]
            ]
        },
        {
            "id": "ae756712.db4dd8",
            "type": "inject",
            "z": "fa43d1e2.b1c88",
            "name": "",
            "props": [
                {
                    "p": "payload"
                },
                {
                    "p": "topic",
                    "vt": "str"
                }
            ],
            "repeat": "",
            "crontab": "",
            "once": false,
            "onceDelay": 0.1,
            "topic": "",
            "payload": "test message",
            "payloadType": "str",
            "x": 150,
            "y": 60,
            "wires": [
                [
                    "dd7244fa.c89398"
                ]
            ]
        },
        {
            "id": "3a9c0b5c.327804",
            "type": "debug",
            "z": "fa43d1e2.b1c88",
            "name": "",
            "active": true,
            "tosidebar": true,
            "console": false,
            "tostatus": false,
            "complete": "false",
            "statusVal": "",
            "statusType": "auto",
            "x": 510,
            "y": 60,
            "wires": []
        }
    ]
    ```