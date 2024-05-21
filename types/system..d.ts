declare namespace System {
  interface ResUploadFile {
    fileResourceId: string
    fileResourceUrls: string
    fileResourceUrlsRespList: [
      {
        fileId: string
        fileURL: string
        type: number
        formatType: number
        gltfFileURL: string
        coverImageType: number
      }
    ]
    globalNo: number
    chunk: string
    fileId: number
  }
  interface ListByType {
    tagType: number
  }

  interface ResListByType {
    name: string
    tagType: number
    tagTypeId: number
    id: number
    createTime: number
    picUrl: string
  }

  interface City {
    id: number
    name: string
    children: City[]
  }
}
