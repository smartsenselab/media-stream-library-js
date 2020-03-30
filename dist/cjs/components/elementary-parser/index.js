"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../component");
const message_1 = require("../message");
const stream_1 = require("stream");
/**
 * A component that converts raw binary data into Elementary packets on
 * the incoming stream.
 * @extends {Component}
 */
class ElementaryParser extends component_1.Tube {
    /**
     * Create a new Elementary parser component.
     * @return {undefined}
     */
    constructor() {
        // Incoming stream
        const incoming = new stream_1.Transform({
            objectMode: true,
            transform: function (msg, encoding, callback) {
                if (msg.type === message_1.MessageType.RAW) {
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
        super(incoming);
    }
}
exports.ElementaryParser = ElementaryParser;
//# sourceMappingURL=index.js.map