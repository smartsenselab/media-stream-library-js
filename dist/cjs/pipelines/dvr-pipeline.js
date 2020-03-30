"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeline_1 = require("./pipeline");
const ws_source_1 = require("../components/ws-source");
const elementary_parser_1 = require("../components/elementary-parser");
class DvrPipeline extends pipeline_1.Pipeline {
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    constructor(config) {
        const { ws: wsConfig, mediaElement } = config;
        const elementaryParser = new elementary_parser_1.ElementaryParser();
        super(elementaryParser);
        const waitForWs = ws_source_1.WSSource.open(wsConfig);
        this.ready = waitForWs.then(wsSource => {
            wsSource.onServerClose = () => {
                this.onServerClose && this.onServerClose();
            };
            this.prepend(wsSource);
            this._src = wsSource;
        });
    }
}
exports.DvrPipeline = DvrPipeline;
//# sourceMappingURL=dvr-pipeline.js.map