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
/**
 * A component that converts raw binary data into Elementary packets on
 * the incoming stream.
 * @extends {Component}
 */
var ElementaryParser = /** @class */ (function (_super) {
    __extends(ElementaryParser, _super);
    /**
     * Create a new Elementary parser component.
     * @return {undefined}
     */
    function ElementaryParser() {
        var _this = this;
        // Incoming stream
        var incoming = new Transform({
            objectMode: true,
            transform: function (msg, encoding, callback) {
                if (msg.type === MessageType.RAW) {
                    // parse timestamp and h264 data
                    // parser.parse(msg.data).forEach(message => incoming.push(message))
                    callback();
                }
                else {
                    // Not a message we should handle
                    callback(undefined, msg);
                }
            }
        });
        _this = _super.call(this, incoming) || this;
        return _this;
    }
    return ElementaryParser;
}(Tube));
export { ElementaryParser };
//# sourceMappingURL=index.js.map