"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtsp_pipeline_1 = require("./rtsp-pipeline");
const onvifdepay_1 = require("../components/onvifdepay");
const ws_source_1 = require("../components/ws-source");
const message_1 = require("../components/message");
const component_1 = require("../components/component");
// Default configuration for XML event stream
const DEFAULT_RTSP_PARAMETERS = {
    parameters: ['audio=0', 'video=0', 'event=on', 'ptz=all'],
};
/**
 * Pipeline that can receive XML metadata over RTP
 * over WebSocket and pass it to a handler.
 */
class MetadataPipeline extends rtsp_pipeline_1.RtspPipeline {
    constructor(config) {
        const { ws: wsConfig, rtsp: rtspConfig, metadataHandler } = config;
        super(Object.assign({}, DEFAULT_RTSP_PARAMETERS, rtspConfig));
        const onvifDepay = new onvifdepay_1.ONVIFDepay();
        this.append(onvifDepay);
        const handlerSink = component_1.Sink.fromHandler(msg => {
            if (msg.type === message_1.MessageType.XML) {
                metadataHandler(msg);
            }
        });
        this.append(handlerSink);
        const waitForWs = ws_source_1.WSSource.open(wsConfig);
        this.ready = waitForWs.then(wsSource => {
            wsSource.onServerClose = () => {
                this.onServerClose && this.onServerClose();
            };
            this.prepend(wsSource);
            this._src = wsSource;
        });
    }
    close() {
        this._src && this._src.outgoing.end();
    }
}
exports.MetadataPipeline = MetadataPipeline;
//# sourceMappingURL=metadata-pipeline.js.map