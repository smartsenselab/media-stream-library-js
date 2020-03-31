import { EncoderParams } from './index';
export declare const sdpMessage: (encoderParams: EncoderParams) => {
    media: {
        rtpmap: {
            payloadType: number;
            encodingName: string;
            clockrate: number;
        };
        type: string;
        fmtp: {
            parameters: EncoderParams;
        };
        framerate: number;
    }[];
};
