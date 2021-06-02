# node-red-base

Quick-start template repository for creating new Node-RED self-made node sets in Node-RED.

## Create a development environment

- Docker(`nodered/node-red`) install

    ```cmd
    docker-compose up -d
    ```

    **Note**: This node-red-base requires docker and docker-compose.

## Folder structure

```cmd
C:.
│
├─dist ※ Build output folder
├─figs
├─nodes
├─src   ※ Development folder
│   ├─icons
│   └─locales
│       ├─en-US
│       └─ja
├─test
│   ├─data  ※ Docker(`nodered/node-red`) volume
│   │  ├─dev
│   │  │  └─node-red-contrib-XXXXXXXXXX ※ A set of installation files for your Node-RED self-made node
│   │  ├─lib
│   │  └─node_modules
│   └─
│
├─nodes ※ Node-RED self-made node sets
│   ├─icons
│   ├─locales
│   ├─...
│
├─node_modules
│
```

- ビルドとインストール

    以下コマンドで、自動でビルドとインストールが出来ます。

    ```cmd
    .\build.bat
    ```

    ※windows用
