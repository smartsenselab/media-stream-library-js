import { PassThrough, Readable, Writable } from 'stream';
import StreamFactory from './helpers/stream-factory';
class AbstractComponent {
}
export class Source extends AbstractComponent {
    constructor(incoming = new Readable({ objectMode: true }), outgoing = new Writable({ objectMode: true })) {
        super();
        this.incoming = incoming;
        this.outgoing = outgoing;
        this.next = null;
        this.prev = null;
    }
    /**
     * Set up a component that emits incoming messages.
     * @param {Array} messages List of objects (with data property) to emit.
     * @return {Component}
     */
    static fromMessages(messages) {
        const component = new Source(StreamFactory.producer(messages), StreamFactory.consumer());
        return component;
    }
    /**
     * Attach another component so the the 'down' stream flows into the
     * next component 'down' stream and the 'up' stream of the other component
     * flows into the 'up' stream of this component. This is what establishes the
     * meaning of 'up' and 'down'.
     * @param {Component} next - The component to connect.
     * @return {Component} - A reference to the connected component.
     *
     *      -------------- pipe --------------
     *  <-  |  outgoing  |  <-  |  outgoing  | <-
     *      |    this    |      |    next    |
     *  ->  |  incoming  |  ->  |  incoming  | ->
     *      -------------- pipe --------------
     */
    connect(next) {
        // If the next component is not there, we want to return this component
        // so that it is possible to continue to chain. If there is a next component,
        // but this component already has a next one, or the next one already has a
        // previous component, throw an error.
        if (next === null) {
            return this;
        }
        else if (this.next !== null || next.prev !== null) {
            throw new Error('connection failed: component(s) already connected');
        }
        try {
            this.incoming.pipe(next.incoming);
            next.outgoing.pipe(this.outgoing);
        }
        catch (e) {
            throw new Error(`connection failed: ${e.message}`);
        }
        /**
         * Propagate errors back upstream, this assures an error will be propagated
         * to all previous streams (but not further than any endpoints). What happens
         * when an error is emitted on a stream is up to the stream's implementation.
         */
        const incomingErrorHandler = err => {
            this.incoming.emit('error', err);
        };
        next.incoming.on('error', incomingErrorHandler);
        const outgoingErrorHandler = err => {
            next.outgoing.emit('error', err);
        };
        this.outgoing.on('error', outgoingErrorHandler);
        // Keep a bidirectional linked list of components by storing
        // a reference to the next component and the listeners that we set up.
        this.next = next;
        next.prev = this;
        this._incomingErrorHandler = incomingErrorHandler;
        this._outgoingErrorHandler = outgoingErrorHandler;
        return next;
    }
    /**
     * Disconnect the next connected component. When there is no next component
     * the function will just do nothing.
     * @return {Component} - A reference to this component.
     */
    disconnect() {
        const next = this.next;
        if (next !== null) {
            this.incoming.unpipe(next.incoming);
            next.outgoing.unpipe(this.outgoing);
            if (typeof this._incomingErrorHandler !== 'undefined') {
                next.incoming.removeListener('error', this._incomingErrorHandler);
            }
            if (typeof this._outgoingErrorHandler !== 'undefined') {
                this.outgoing.removeListener('error', this._outgoingErrorHandler);
            }
            this.next = null;
            next.prev = null;
            delete this._incomingErrorHandler;
            delete this._outgoingErrorHandler;
        }
        return this;
    }
}
export class Tube extends Source {
    constructor(incoming = new PassThrough({ objectMode: true }), outgoing = new PassThrough({ objectMode: true })) {
        super(incoming, outgoing);
        this.incoming = incoming;
        this.outgoing = outgoing;
    }
    static fromHandlers(fnIncoming, fnOutgoing) {
        const incomingStream = fnIncoming
            ? StreamFactory.peeker(fnIncoming)
            : undefined;
        const outgoingStream = fnOutgoing
            ? StreamFactory.peeker(fnOutgoing)
            : undefined;
        return new Tube(incomingStream, outgoingStream);
    }
}
export class Sink extends AbstractComponent {
    constructor(incoming = new Writable({ objectMode: true }), outgoing = new Readable({ objectMode: true })) {
        super();
        this.incoming = incoming;
        this.outgoing = outgoing;
        this.next = null;
        this.prev = null;
    }
    /**
     * Set up a component that swallows incoming data (calling fn on it).
     * To print data, you would use fn = console.log.
     * @param {Function} fn The callback to use for the incoming data.
     * @return {Component}
     */
    static fromHandler(fn) {
        const component = new Sink(StreamFactory.consumer(fn), StreamFactory.producer(undefined));
        // A sink should propagate when stream is ending.
        component.incoming.on('finish', () => {
            component.outgoing.push(null);
        });
        return component;
    }
    connect() {
        throw new Error('connection failed: attempting to connect after a sink');
    }
    disconnect() {
        return this;
    }
}
//# sourceMappingURL=component.js.map