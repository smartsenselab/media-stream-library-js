const METADATA_PADDING = 13
const START_CODE_LENGTH = 4
const NON_IDR_PICTURE = 65
const IDR_PICTURE = 104

const matchesNaluType = (sequence: Buffer, naluType: number) => {
  return (
    sequence[0] == 0 &&
    sequence[1] == 0 &&
    sequence[2] == 0 &&
    sequence[3] == 1 &&
    sequence[4] == naluType
  )
}

const indexOfNaluType = (buffer: Buffer, naluType: number) => {
  let offset = 0

  do {
    var index = buffer.indexOf(naluType, offset)
    var sequence = buffer.slice(index - 4, index + 1)
    offset = index + 1
  } while(!matchesNaluType(sequence, naluType))

  return index
}

// Convert Annex-B to AVCC format
export const payload = (buffer: Buffer) => {
  let naluType = 
    (buffer[METADATA_PADDING + START_CODE_LENGTH] == NON_IDR_PICTURE) ?
      NON_IDR_PICTURE :
      IDR_PICTURE

  let index = indexOfNaluType(buffer, naluType)
  let nalu = buffer.slice(index)  

  let data = new DataView(new ArrayBuffer(4))
  data.setUint32(0, nalu.length)
  let length = Buffer.from(data.buffer)

  return Buffer.concat([
    length,
    nalu
  ])    
}

export const timestamp = (buffer: Buffer) => {
  return buffer.readDoubleBE(5) * 1000
}

export const frameId = (buffer: Buffer) => {
  return buffer.readInt32BE(1)
}

export const isKeyFrame = (buffer: Buffer) => {
  return !!buffer[0]
}