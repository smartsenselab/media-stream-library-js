"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../component");
const stream_1 = require("stream");
const message_1 = require("../message");
const rtp_1 = require("../../utils/protocols/rtp");
const parser_1 = require("./parser");
class H264Depay extends component_1.Tube {
    constructor() {
        let h264PayloadType;
        let idrFound = false;
        const h264DepayParser = new parser_1.H264DepayParser();
        // Incoming
        const incoming = new stream_1.Transform({
            objectMode: true,
            transform: function (msg, encoding, callback) {
                // Get correct payload types from sdp to identify video and audio
                if (msg.type === message_1.MessageType.SDP) {
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
                else if (msg.type === message_1.MessageType.RTP &&
                    rtp_1.payloadType(msg.data) === h264PayloadType) {
                    const h264Message = h264DepayParser.parse(msg);
                    // Skip if not a full H264 frame, or when there hasn't been an I-frame yet
                    if (h264Message === null ||
                        (!idrFound && h264Message.nalType !== parser_1.NAL_TYPES.IDR_PICTURE)) {
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
exports.H264Depay = H264Depay;
//# sourceMappingURL=index.js.map