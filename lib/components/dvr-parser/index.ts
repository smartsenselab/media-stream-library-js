import { Tube } from '../component'
import { Message, MessageType, H264Message } from '../message'
import { Transform } from 'stream'
import { isKeyFrame, frameId, timestamp, payload } from '../../utils/protocols/dvr'
import { NAL_TYPES } from '../h264depay/parser'
import { sdpMessage } from './sdp'

/**
 * A component that converts raw binary data into S3MS DVR packets 
 * on the incoming stream.
 * @extends {Component}
 */
export class DvrParser extends Tube {
  /**
   * Create a new DVR parser component.
   * @return {undefined}
   */
  constructor() {
    let sentSdp = false
    let idrFound = false

    // Incoming stream
    const incoming = new Transform({
      objectMode: true,
      transform: function(raw: Message, encoding, callback) {
        if(!sentSdp) {
          incoming.push({
            data: [],
            type: MessageType.SDP,
            sdp: sdpMessage
          })

          sentSdp = true
        }

        const msg: H264Message = {
          data: payload(raw.data),
          type: MessageType.H264,
          timestamp: timestamp(raw.data),
          ntpTimestamp: timestamp(raw.data),
          dvrFrameId: frameId(raw.data),
          payloadType: 96,
          nalType: isKeyFrame(raw.data) ? 
            NAL_TYPES.IDR_PICTURE : 
            NAL_TYPES.NON_IDR_PICTURE
        }

        // Skip if there hasn't been an I-frame yet
        if (
          !idrFound && msg.nalType !== NAL_TYPES.IDR_PICTURE
        ) {
          callback()
          return
        }
        
        idrFound = true
        callback(undefined, msg)
      }
    })

    super(incoming)
  }
}