import { Tube } from '../component';
import { MessageType } from '../message';
import { Transform } from 'stream';
/**
 * A component that converts raw binary data into Elementary packets on
 * the incoming stream.
 * @extends {Component}
 */
export class ElementaryParser extends Tube {
    /**
     * Create a new Elementary parser component.
     * @return {undefined}
     */
    constructor() {
        // Incoming stream
        const incoming = new Transform({
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
        super(incoming);
    }
}
//# sourceMappingURL=index.js.map