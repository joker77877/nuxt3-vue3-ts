interface UploadParams {
  // type: EnumTypes<typeof AssetTypeEnum>
  id?: string
  name?: string
  introduction?: string
  description?: string
  categoryId?: number
  fileResourceId: string
  personalPrice?: number
  enterprisesPrice?: number
  copyrightPrice?: number
  status?: number
  tags?: string[]
  publishType?: number
  spuType?: EnumTypes<typeof AssetTypeEnum> // 限量资产还是普通资产
  price?: number
  stock?: number
  publisher?: string
}

interface FileResourceUrl {
  fileId: string
  fileURL: string
  type: number
  formatType: number
  gltfFileURL?: string
  coverImageType?: number
}
/* 发布作品 */
declare namespace PublishProduct {
  type Params = UploadParams
  type Result = true
}

/* 保存草稿 */
declare namespace SaveDraft {
  type Params = UploadParams
  type Result = string
}

/* 传输单文件 */
declare namespace UploadOneFile {
  interface Params {
    multipartFile: UploadRawFile | File
    type: 1 | 2 // 1表是3D资产文件类型，2、表示普通文件
    fHash: string
    spuType?: number
  }
  interface Result {
    fileResourceId: string
    fileResourceUrls: string
    fileResourceUrlsRespList: FileResourceUrl[]
    globalNo?: any
    chunk?: any
  }
}
declare namespace UpdateFile3D {
  interface Params {
    multipartFile: File
    type: number
    fileResourceId: string
    isBlock: number
    coverImageType: number
    formatDetails: string
    fHash: string
  }
  type Result = true
}
declare namespace UploadChunkFile {
  interface Params {
    multipartFile: Blob
    chunk: number
    fHash: string
    chunks: number
    type: number
    chunkSize: number
    fileId?: number
  }
  interface Result {
    fileResourceId: string
    fileId: number
    fileResourceUrls: string
    fileResourceUrlsRespList: FileResourceUrl[]
    globalNo?: any
    chunk?: any
  }
}
declare namespace GetFileIsExist {
  interface Params {
    /**
     * 文件资源hash
     */
    fileResourceHash: string
  }
  interface Result {
    productId: number
    name: string
    chunk: string
    coverImage: string
    fileResourceUrlsRespVO: string
    id: number
    fileId: number
    message: boolean
    type: 1 | 2 | 3 | 4
    spuType: 1 | 2 | 3 // AssetTypeEnum
    saleMode: number[] // ProductCopyRightType
    spuStatus: number
  }
}

declare namespace GetProductCategoryList {
  interface ProductCategory {
    id: number
    parentId: number
    name: string
    picUrl: string
  }
  type Result = ProductCategory[]
}
declare namespace GetWorksDetail {
  interface Params {
    id: string
    from: string
  }
  interface Result {
    id: number
    name: string
    introduction: string
    description: string
    categoryId?: number
    categoryIds: number[]
    status: number
    categoryName: string
    picUrl: string
    saleMode: any[]
    personalPrice?: number
    enterprisesPrice?: number
    copyrightPrice?: number
    tags: string[]
    publishType?: number
    fileResourceId: string
    fileResourceUrlsResp: FileResourceUrl
    spuType: number
    saleMode: number[]
  }
}
declare namespace GetResourceInfo {
  interface Params {
    fileResourceId: NumberLiteralType
  }
  interface Result {
    id: string
    productId: string
    creatorId: number
    copyrightUserId: number
    name: string
    formatDetails: string
    fileResourceUrlsList: FileResourceUrl[]
    type: string
    fileResourceHash: string
    spuType: 1 | 2 | 3 // AssetTypeEnum
    saleMode: number[] // ProductCopyRightType
    editInfo: string
  }
}

