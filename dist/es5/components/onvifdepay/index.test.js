import { ONVIFDepay } from '.';
import { runComponentTests } from '../../utils/validate-component';
describe('ONVIF depay component', function () {
    describe('is a valid component', function () {
        var c = new ONVIFDepay();
        runComponentTests(c, 'ONVIF depay component');
    });
});
//# sourceMappingURL=index.test.js.map