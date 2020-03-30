import { Pipeline } from './pipeline';
import { WSConfig } from '../components/ws-source/openwebsocket';
import { MediaTrack } from '../components/mse';
export interface DvrConfig {
    ws: WSConfig;
    mediaElement: HTMLVideoElement;
}
export declare class DvrPipeline extends Pipeline {
    onSourceOpen?: (mse: MediaSource, tracks: MediaTrack[]) => void;
    onServerClose?: () => void;
    ready: Promise<void>;
    private _src?;
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    constructor(config: DvrConfig);
}
