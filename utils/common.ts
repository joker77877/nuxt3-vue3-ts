
/**
 * @description: 获取文件hash
 * @param {UploadRawFile} file
 * @return {*}
 */
export const getFileHash = (file: UploadRawFile | File) => {
  const promise = new Promise<string>((resolve) => {
    const worker = new Worker(new URL("@/workers/worker.ts", import.meta.url), { type: "module" })
    worker.postMessage({ file, FILE_CHUNK_SIZE })
    worker.onmessage = (e: any) => {
      const { hash, chunks }: { hash: string; chunks: Blob[] } = e.data
      if (hash) {
        resolve(hash)
      }
    }
  })
  return promise
}
/**
 * base64 转换为 file
 * 先将base64转换成blob，再将blob转换成file文件，此方法不存在浏览器不兼容问题
 * @param base64Url
 * @param filename
 * @returns
 */
export const base64UrlToFile = (base64Url: string, filename: string) => {
  // 获取到base64编码
  const arr = base64Url.split(",")
  const mime = arr?.[0].match(/:(.*?);/)?.[1]
  // 将base64编码转为字符串
  const bstr = atob(arr[1])
  let n = bstr.length
  // 创建初始化为0的，包含length个元素的无符号整型数组
  const u8arr = new Uint8Array(n)
  while (n) {
    n -= 1
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
