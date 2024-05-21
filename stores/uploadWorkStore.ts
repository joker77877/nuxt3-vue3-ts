const uploadWorkStore = reactive<{
  fileList: UploadFile[]
  fileChunks: Blob[]
  fileHash: string
}>({
  fileList: [],
  fileChunks: [],
  fileHash: ""
})
const clearUploadWorkStore = () => {
  uploadWorkStore.fileList = []
  uploadWorkStore.fileChunks = []
  uploadWorkStore.fileHash = ""
}

export { uploadWorkStore, clearUploadWorkStore }
