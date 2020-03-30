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
import { WSSource } from '../components/ws-source';
import { ElementaryParser } from '../components/elementary-parser';
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
        var elementaryParser = new ElementaryParser();
        _this = _super.call(this, elementaryParser) || this;
        var waitForWs = WSSource.open(wsConfig);
        _this.ready = waitForWs.then(function (wsSource) {
            wsSource.onServerClose = function () {
                _this.onServerClose && _this.onServerClose();
            };
            _this.prepend(wsSource);
            _this._src = wsSource;
        });
        return _this;
    }
    return DvrPipeline;
}(Pipeline));
export { DvrPipeline };
//# sourceMappingURL=dvr-pipeline.js.map