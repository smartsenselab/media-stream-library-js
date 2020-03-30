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
import { Pipeline } from './pipeline';
import { MseSink } from '../components/mse';
import { WSSource } from '../components/ws-source';
import { DvrParser } from '../components/dvr-parser';
import { Mp4Muxer } from '../components/mp4muxer';
var DvrPipeline = /** @class */ (function (_super) {
    __extends(DvrPipeline, _super);
    /**
     * Creates an instance of DvrPipeline.
     * @param {any} [config={}] Component options
     * @memberof DvrPipeline
     */
    function DvrPipeline(config) {
        var _this = this;
        var wsConfig = config.ws, mediaElement = config.mediaElement;
        var dvrParser = new DvrParser();
        var mp4Muxer = new Mp4Muxer();
        mp4Muxer.onSync = function (ntpPresentationTime) {
            _this.onSync && _this.onSync(ntpPresentationTime);
        };
        var mseSink = new MseSink(mediaElement);
        mseSink.onSourceOpen = function (mse, tracks) {
            _this.onSourceOpen && _this.onSourceOpen(mse, tracks);
        };
        _this = _super.call(this, dvrParser, mp4Muxer, mseSink) || this;
        var waitForWs = WSSource.open(wsConfig);
        _this.ready = waitForWs.then(function (wsSource) {
            wsSource.onServerClose = function () {
                _this.onServerClose && _this.onServerClose();
            };
            _this.prepend(wsSource);
        });
        return _this;
    }
    return DvrPipeline;
}(Pipeline));
export { DvrPipeline };
//# sourceMappingURL=dvr-pipeline.js.map