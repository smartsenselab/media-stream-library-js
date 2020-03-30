"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const html5_video_pipeline_1 = require("./html5-video-pipeline");
const onvifdepay_1 = require("../components/onvifdepay");
const message_1 = require("../components/message");
const component_1 = require("../components/component");
/**
 * Pipeline that can receive H264/AAC video over RTP
 * over WebSocket and pass it to a video element.
 * Additionally, this pipeline passes XML metadata sent
 * in the same stream to a handler.
 */
class Html5VideoMetadataPipeline extends html5_video_pipeline_1.Html5VideoPipeline {
    constructor(config) {
        const { metadataHandler } = config;
        super(config);
        const onvifDepay = new onvifdepay_1.ONVIFDepay();
        this.insertAfter(this.rtsp, onvifDepay);
        const onvifHandlerPipe = component_1.Tube.fromHandlers(msg => {
            if (msg.type === message_1.MessageType.XML) {
                metadataHandler(msg);
            }
        }, undefined);
        this.insertAfter(onvifDepay, onvifHandlerPipe);
    }
}
exports.Html5VideoMetadataPipeline = Html5VideoMetadataPipeline;
//# sourceMappingURL=html5-video-metadata-pipeline.js.map