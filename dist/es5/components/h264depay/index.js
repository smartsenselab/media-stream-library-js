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
import { Transform } from 'stream';
import { MessageType } from '../message';
import { payloadType } from '../../utils/protocols/rtp';
import { H264DepayParser, NAL_TYPES } from './parser';
var H264Depay = /** @class */ (function (_super) {
    __extends(H264Depay, _super);
    function H264Depay() {
        var _this = this;
        var h264PayloadType;
        var idrFound = false;
        var h264DepayParser = new H264DepayParser();
        // Incoming
        var incoming = new Transform({
            objectMode: true,
            transform: function (msg, encoding, callback) {
                // Get correct payload types from sdp to identify video and audio
                if (msg.type === MessageType.SDP) {
                    var h264Media = msg.sdp.media.find(function (media) {
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
                    var h264Message = h264DepayParser.parse(msg);
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
        _this = _super.call(this, incoming) || this;
        return _this;
    }
    return H264Depay;
}(Tube));
export { H264Depay };
//# sourceMappingURL=index.js.map