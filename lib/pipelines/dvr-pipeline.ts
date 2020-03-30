import { Pipeline } from './pipeline'
import { WSConfig } from '../components/ws-source/openwebsocket'
import { MseSink, MediaTrack } from '../components/mse'
import { WSSource } from '../components/ws-source'
import { DvrParser } from '../components/dvr-parser'
import { Mp4Muxer } from '../components/mp4muxer'

export interface DvrConfig {
  ws: WSConfig
  mediaElement: HTMLVideoElement
}

export class DvrPipeline extends Pipeline {
  public onSourceOpen?: (mse: MediaSource, tracks: MediaTrack[]) => void
  public onServerClose?: () => void
  public onSync?: (ntpPresentationTime: number) => void
  public ready: Promise<void>

  /**
   * Creates an instance of DvrPipeline.
   * @param {any} [config={}] Component options
   * @memberof DvrPipeline
   */
  constructor(config: DvrConfig) {
    const {
      ws: wsConfig,
      mediaElement
    } = config

    const dvrParser = new DvrParser()
    const mp4Muxer = new Mp4Muxer()

    mp4Muxer.onSync = ntpPresentationTime => {
      this.onSync && this.onSync(ntpPresentationTime)
    }

    const mseSink = new MseSink(mediaElement)
    mseSink.onSourceOpen = (mse, tracks) => {
      this.onSourceOpen && this.onSourceOpen(mse, tracks)
    }

    super(dvrParser, mp4Muxer, mseSink)

    const waitForWs = WSSource.open(wsConfig)
    this.ready = waitForWs.then(wsSource => {
      wsSource.onServerClose = () => {
        this.onServerClose && this.onServerClose()
      }
      this.prepend(wsSource)
    })    
  }
}
