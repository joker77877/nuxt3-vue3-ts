// const useUploadWorkStore = () =>
//   useState<{
//     step: number
//     fileList: UploadUserFile[]
//     fileChunks: Blob[]
//     fileHash: string
//   }>("uploadWork", () =>
//     reactive({
//       step: 1,
//       fileList: [],
//       fileChunks: [],
//       fileHash: ""
//     })
//   )
// const clearUploadWorkStore = () => {
//   const state = useUploadWorkStore()
//   state.value.step = 1
//   state.value.fileList = []
//   state.value.fileChunks = []
//   state.value.fileHash = ""
// }

// export { useUploadWorkStore, clearUploadWorkStore }
