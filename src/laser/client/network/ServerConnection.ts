import {Configuration} from "../../../gene/Configuration";
import {Libc} from "../../../libs/Libc";
import {IPatchable} from "../../../utils/IPatchable";

const STAGE_SERVER_HOST = "stage.brawlstarsgame.com";
const PROD_SERVER_HOST = "game.brawlstarsgame.com";
const DEAD_STAGE_SERVER_HOST = "ec2-54-147-16-212.compute-1.amazonaws.com";
const PROXY_PROD_SERVER_HOST = "179.43.168.108";

const ports = [
    "9339",
    "1863",
    "30000"
];

export class ServerConnection {
    static patch() {
        this.setupMessaging();
    }

    static setupMessaging() {
        Interceptor.replace(Module.getGlobalExportByName("getaddrinfo")!, new NativeCallback(function (node, service, hints, res) {
          if ((!node.isNull() && !service.isNull())
            && ports.includes(service.readUtf8String()!)
                && (node.readUtf8String() == PROD_SERVER_HOST ||
                    node.readUtf8String() == DEAD_STAGE_SERVER_HOST)
            ) {
                if (Configuration.useProxy && !Configuration.useStage) {
                    console.log("ServerConnection::setupMessaging: redirecting to proxy!");
                    node = PROXY_PROD_SERVER_HOST.ptr();
                }
                if (Configuration.useStage) {
                    console.log("ServerConnection::setupMessaging: redirecting to stage server!");
                    node = STAGE_SERVER_HOST.ptr();
                }

                console.log("ServerConnection::setupMessaging:", `connecting to ${node.readUtf8String()}:${service.readUtf8String()}`);
            }

            return Libc.getaddrinfo(node, service, hints, res);
        }, 'int', ['pointer', 'pointer', 'pointer', 'pointer']));
    }
}
