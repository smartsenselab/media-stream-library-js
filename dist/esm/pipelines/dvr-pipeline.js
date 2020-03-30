import { Pipeline } from './pipeline';
import { WSSource } from '../components/ws-source';
import { ElementaryParser } from '../components/elementary-parser';
export class DvrPipeline extends Pipeline {
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    constructor(config) {
        const { ws: wsConfig, mediaElement } = config;
        const elementaryParser = new ElementaryParser();
        super(elementaryParser);
        const waitForWs = WSSource.open(wsConfig);
        this.ready = waitForWs.then(wsSource => {
            wsSource.onServerClose = () => {
                this.onServerClose && this.onServerClose();
            };
            this.prepend(wsSource);
            this._src = wsSource;
        });
    }
}
//# sourceMappingURL=dvr-pipeline.js.map