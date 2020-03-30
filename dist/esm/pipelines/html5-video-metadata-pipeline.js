import { Html5VideoPipeline } from './html5-video-pipeline';
import { ONVIFDepay } from '../components/onvifdepay';
import { MessageType } from '../components/message';
import { Tube } from '../components/component';
/**
 * Pipeline that can receive H264/AAC video over RTP
 * over WebSocket and pass it to a video element.
 * Additionally, this pipeline passes XML metadata sent
 * in the same stream to a handler.
 */
export class Html5VideoMetadataPipeline extends Html5VideoPipeline {
    constructor(config) {
        const { metadataHandler } = config;
        super(config);
        const onvifDepay = new ONVIFDepay();
        this.insertAfter(this.rtsp, onvifDepay);
        const onvifHandlerPipe = Tube.fromHandlers(msg => {
            if (msg.type === MessageType.XML) {
                metadataHandler(msg);
            }
        }, undefined);
        this.insertAfter(onvifDepay, onvifHandlerPipe);
    }
}
//# sourceMappingURL=html5-video-metadata-pipeline.js.map