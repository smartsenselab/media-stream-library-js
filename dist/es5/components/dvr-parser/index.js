var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Tube } from '../component';
import { MessageType } from '../message';
import { Transform } from 'stream';
import { isKeyFrame, frameId, timestamp, payload } from '../../utils/protocols/dvr';
import { NAL_TYPES } from '../h264depay/parser';
import { sdpMessage } from './sdp';
/**
 * A component that converts raw binary data into S3MS DVR packets
 * on the incoming stream.
 * @extends {Component}
 */
var DvrParser = /** @class */ (function (_super) {
    __extends(DvrParser, _super);
    /**
     * Create a new DVR parser component.
     * @return {undefined}
     */
    function DvrParser() {
        var _this = this;
        var sentSdp = false;
        var idrFound = false;
        // Incoming stream
        var incoming = new Transform({
            objectMode: true,
            transform: function (raw, encoding, callback) {
                if (!sentSdp) {
                    incoming.push({
                        data: [],
                        type: MessageType.SDP,
                        sdp: sdpMessage
                    });
                    sentSdp = true;
                }
                var msg = {
                    data: payload(raw.data),
                    type: MessageType.H264,
                    timestamp: timestamp(raw.data),
                    ntpTimestamp: timestamp(raw.data),
                    dvrFrameId: frameId(raw.data),
                    payloadType: 96,
                    nalType: isKeyFrame(raw.data) ?
                        NAL_TYPES.IDR_PICTURE :
                        NAL_TYPES.NON_IDR_PICTURE
                };
                // Skip if there hasn't been an I-frame yet
                if (!idrFound && msg.nalType !== NAL_TYPES.IDR_PICTURE) {
                    callback();
                    return;
                }
                idrFound = true;
                callback(undefined, msg);
            }
        });
        _this = _super.call(this, incoming) || this;
        return _this;
    }
    return DvrParser;
}(Tube));
export { DvrParser };
//# sourceMappingURL=index.js.map