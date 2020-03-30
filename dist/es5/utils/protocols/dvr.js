var METADATA_PADDING = 13;
var START_CODE_LENGTH = 4;
var NON_IDR_PICTURE = 65;
var IDR_PICTURE = 104;
var matchesNaluType = function (sequence, naluType) {
    return (sequence[0] == 0 &&
        sequence[1] == 0 &&
        sequence[2] == 0 &&
        sequence[3] == 1 &&
        sequence[4] == naluType);
};
var indexOfNaluType = function (buffer, naluType) {
    var offset = 0;
    do {
        var index = buffer.indexOf(naluType, offset);
        var sequence = buffer.slice(index - 4, index + 1);
        offset = index + 1;
    } while (!matchesNaluType(sequence, naluType));
    return index;
};
// Convert Annex-B to AVCC format
export var payload = function (buffer) {
    var naluType = (buffer[METADATA_PADDING + START_CODE_LENGTH] == NON_IDR_PICTURE) ?
        NON_IDR_PICTURE :
        IDR_PICTURE;
    var index = indexOfNaluType(buffer, naluType);
    var nalu = buffer.slice(index);
    var data = new DataView(new ArrayBuffer(4));
    data.setUint32(0, nalu.length);
    var length = Buffer.from(data.buffer);
    return Buffer.concat([
        length,
        nalu
    ]);
};
export var timestamp = function (buffer) {
    return buffer.readDoubleBE(5) * 1000;
};
export var frameId = function (buffer) {
    return buffer.readInt32BE(1);
};
export var isKeyFrame = function (buffer) {
    return !!buffer[0];
};
//# sourceMappingURL=dvr.js.map