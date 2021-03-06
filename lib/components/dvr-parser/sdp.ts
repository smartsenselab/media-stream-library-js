import { EncoderParams } from './index'

export const sdpMessage = (encoderParams: EncoderParams) => ({
  "media": [
    {
      "rtpmap": {
        "payloadType": 96,
        "encodingName": "H264",
        "clockrate": 90000
      },
      "type": "video",
      "fmtp": {
        "parameters": encoderParams
      },
      "framerate": 30
    }
  ]
})