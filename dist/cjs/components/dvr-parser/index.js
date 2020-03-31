"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../component");
const message_1 = require("../message");
const stream_1 = require("stream");
const dvr_1 = require("../../utils/protocols/dvr");
const parser_1 = require("../h264depay/parser");
const sdp_1 = require("./sdp");
/**
 * A component that converts raw binary data into S3MS DVR packets
 * on the incoming stream.
 * @extends {Component}
 */
class DvrParser extends component_1.Tube {
    /**
     * Create a new DVR parser component.
     * @return {undefined}
     */
    constructor(encoderParams) {
        let sentSdp = false;
        let idrFound = false;
        // Incoming stream
        const incoming = new stream_1.Transform({
            objectMode: true,
            transform: function (raw, encoding, callback) {
                if (!sentSdp) {
                    incoming.push({
                        data: [],
                        type: message_1.MessageType.SDP,
                        sdp: sdp_1.sdpMessage(encoderParams)
                    });
                    sentSdp = true;
                }
                const msg = {
                    data: dvr_1.payload(raw.data),
                    type: message_1.MessageType.H264,
                    timestamp: dvr_1.timestamp(raw.data),
                    ntpTimestamp: dvr_1.timestamp(raw.data),
                    dvrFrameId: dvr_1.frameId(raw.data),
                    payloadType: 96,
                    nalType: dvr_1.isKeyFrame(raw.data) ?
                        parser_1.NAL_TYPES.IDR_PICTURE :
                        parser_1.NAL_TYPES.NON_IDR_PICTURE
                };
                // Skip if there hasn't been an I-frame yet
                if (!idrFound && msg.nalType !== parser_1.NAL_TYPES.IDR_PICTURE) {
                    callback();
                    return;
                }
                idrFound = true;
                callback(undefined, msg);
            }
        });
        super(incoming);
    }
}
exports.DvrParser = DvrParser;
//# sourceMappingURL=index.js.map