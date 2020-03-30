export declare const sdpMessage: {
    media: {
        rtpmap: {
            payloadType: number;
            encodingName: string;
            clockrate: number;
        };
        type: string;
        fmtp: {
            parameters: {
                "profile-level-id": string;
                "sprop-parameter-sets": string;
            };
        };
        framerate: number;
    }[];
};
