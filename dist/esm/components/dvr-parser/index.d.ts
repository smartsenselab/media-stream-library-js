import { Tube } from '../component';
export interface EncoderParams {
    'profile-level-id': string;
    'sprop-parameter-sets': string;
}
/**
 * A component that converts raw binary data into S3MS DVR packets
 * on the incoming stream.
 * @extends {Component}
 */
export declare class DvrParser extends Tube {
    /**
     * Create a new DVR parser component.
     * @return {undefined}
     */
    constructor(encoderParams: EncoderParams);
}
