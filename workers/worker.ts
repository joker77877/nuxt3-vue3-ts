import SparkMD5 from "spark-md5"

// eslint-disable-next-line no-restricted-globals
addEventListener("message", (e) => {
  const { file, FILE_CHUNK_SIZE }: { file: File; FILE_CHUNK_SIZE: number } = e.data
  const createFileChunk = (f: File, size = FILE_CHUNK_SIZE) => {
    const fileChunkList = []
    let cur = 0
    while (cur < f.size) {
      fileChunkList.push(f.slice(cur, cur + size))
      cur += size
    }
    return fileChunkList
  }
  const chunks = createFileChunk(file)
  const spark = new SparkMD5.ArrayBuffer()
  const reader = new FileReader()

  const newChunks: Blob[] = []
  const MID = FILE_CHUNK_SIZE / 2
  chunks.forEach((chunk, index) => {
    if (index === 0 || index === chunks.length - 1) {
      newChunks.push(chunk)
    } else {
      newChunks.push(chunk.slice(0, 2))
      newChunks.push(chunk.slice(MID, MID + 2))
      newChunks.push(chunk.slice(FILE_CHUNK_SIZE - 2, FILE_CHUNK_SIZE))
    }
  })
  reader.onload = (v) => {
    if (v.target) {
      spark.append(v.target.result as ArrayBuffer)
      return postMessage({ hash: spark.end(), chunks })
    }
    return false
  }
  reader.readAsArrayBuffer(new Blob(newChunks))
})
export default {}
