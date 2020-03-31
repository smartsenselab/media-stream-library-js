import { Pipeline } from './pipeline';
import { WSConfig } from '../components/ws-source/openwebsocket';
import { MediaTrack } from '../components/mse';
import { EncoderParams } from '../components/dvr-parser';
export interface DvrConfig {
    ws: WSConfig;
    encoderParams: EncoderParams;
    mediaElement: HTMLVideoElement;
}
export declare class DvrPipeline extends Pipeline {
    onSourceOpen?: (mse: MediaSource, tracks: MediaTrack[]) => void;
    onServerClose?: () => void;
    onSync?: (ntpPresentationTime: number) => void;
    ready: Promise<void>;
    private _src?;
    private _sink;
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    constructor(config: DvrConfig);
    close(): void;
    get currentTime(): number;
}
