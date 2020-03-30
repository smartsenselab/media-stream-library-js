import { Tube } from '../component';
import { Transform } from 'stream';
import { MessageType } from '../message';
import { payloadType } from '../../utils/protocols/rtp';
import { H264DepayParser, NAL_TYPES } from './parser';
export class H264Depay extends Tube {
    constructor() {
        let h264PayloadType;
        let idrFound = false;
        const h264DepayParser = new H264DepayParser();
        // Incoming
        const incoming = new Transform({
            objectMode: true,
            transform: function (msg, encoding, callback) {
                // Get correct payload types from sdp to identify video and audio
                if (msg.type === MessageType.SDP) {
                    const h264Media = msg.sdp.media.find((media) => {
                        return (media.type === 'video' &&
                            media.rtpmap !== undefined &&
                            media.rtpmap.encodingName === 'H264');
                    });
                    if (h264Media !== undefined && h264Media.rtpmap !== undefined) {
                        h264PayloadType = h264Media.rtpmap.payloadType;
                    }
                    callback(undefined, msg); // Pass on the original SDP message
                }
                else if (msg.type === MessageType.RTP &&
                    payloadType(msg.data) === h264PayloadType) {
                    const h264Message = h264DepayParser.parse(msg);
                    // Skip if not a full H264 frame, or when there hasn't been an I-frame yet
                    if (h264Message === null ||
                        (!idrFound && h264Message.nalType !== NAL_TYPES.IDR_PICTURE)) {
                        callback();
                        return;
                    }
                    idrFound = true;
                    callback(undefined, h264Message);
                }
                else {
                    // Not a message we should handle
                    callback(undefined, msg);
                }
            },
        });
        // outgoing will be defaulted to a PassThrough stream
        super(incoming);
    }
}
//# sourceMappingURL=index.js.map