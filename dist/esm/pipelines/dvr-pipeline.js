import { Pipeline } from './pipeline';
import { MseSink } from '../components/mse';
import { WSSource } from '../components/ws-source';
import { DvrParser } from '../components/dvr-parser';
import { Mp4Muxer } from '../components/mp4muxer';
export class DvrPipeline extends Pipeline {
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    constructor(config) {
        const { ws: wsConfig, encoderParams, mediaElement } = config;
        const dvrParser = new DvrParser(encoderParams);
        const mp4Muxer = new Mp4Muxer();
        mp4Muxer.onSync = ntpPresentationTime => {
            this.onSync && this.onSync(ntpPresentationTime);
        };
        const mseSink = new MseSink(mediaElement);
        mseSink.onSourceOpen = (mse, tracks) => {
            this.onSourceOpen && this.onSourceOpen(mse, tracks);
        };
        super(dvrParser, mp4Muxer, mseSink);
        this._sink = mseSink;
        const waitForWs = WSSource.open(wsConfig);
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
    get currentTime() {
        return this._sink.currentTime;
    }
}
//# sourceMappingURL=dvr-pipeline.js.map