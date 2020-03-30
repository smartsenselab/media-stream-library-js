"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_1 = require("./pipeline");
const mse_1 = require("../components/mse");
const ws_source_1 = require("../components/ws-source");
const dvr_parser_1 = require("../components/dvr-parser");
const mp4muxer_1 = require("../components/mp4muxer");
class DvrPipeline extends pipeline_1.Pipeline {
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    constructor(config) {
        const { ws: wsConfig, mediaElement } = config;
        const dvrParser = new dvr_parser_1.DvrParser();
        const mp4Muxer = new mp4muxer_1.Mp4Muxer();
        mp4Muxer.onSync = ntpPresentationTime => {
            this.onSync && this.onSync(ntpPresentationTime);
        };
        const mseSink = new mse_1.MseSink(mediaElement);
        mseSink.onSourceOpen = (mse, tracks) => {
            this.onSourceOpen && this.onSourceOpen(mse, tracks);
        };
        super(dvrParser, mp4Muxer, mseSink);
        this._sink = mseSink;
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
    get currentTime() {
        return this._sink.currentTime;
    }
}
exports.DvrPipeline = DvrPipeline;
//# sourceMappingURL=dvr-pipeline.js.map