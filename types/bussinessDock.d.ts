interface ServiceTagRecordList {
  tagId: number
  name: string
  tagType: number
}
type MakerStatusType = (typeof MarkerStatusEnum)[keyof typeof MarkerStatusEnum]
interface MakerForm {
  makerName: string
  makerWebsite: string
  makerIntroduction: string
  makerPicUrl: string
  status: number
  serviceTagIdList: number[]
  makerSelfLabel: string[]
  sectorTagId?: number
}
interface MakerInfo {
  id: number
  userId: string
  makerName: string
  makerWebsite: string
  makerIntroduction: string
  makerPicUrl: string
  status: MakerStatusType
  serviceTagIdList: number[]
  serviceTagNameList: string[]
  serviceTagRecordList: ServiceTagRecordList[]
  sectorTagId: number
  sectorTagName: string
  areaId: number
  areaName: string
  sectorTagRecord: ServiceTagRecordList
  makerSelfLabel: string[]
  countdownTime: number
  updateFlag: boolean
  designerFlag: boolean
}

declare namespace GetMakerList {
  interface Params {
    pageNo?: number
    pageSize?: number
    userIds?: number
    industryIds?: number[]
    areaIds?: number[]
    userRoles?: number
    keyword?: string
    recommend?: boolean
    position?: number
    status?: number
    sortFieldType: number
    notInUserIds?: number[]
  }
  interface Item {
    id: number
    userId: number
    markName: string
    makerWebsite: string
    makerIntroduction: string
    makerPicUrl: string
    makerBrowseCount: number
  }
  interface Result {
    list: Item[]
    total: number
  }
}
declare namespace GetMakerDetail {
  interface Params {
    makerId?: number
  }
  type Result = MakerInfo
}
declare namespace UpdateMaker {
  interface Params {
    id?: number
    userId?: number
    makerName: string
    makerWebsite: string
    makerIntroduction: string
    makerPicUrl: string
    status: number
    serviceTagIdList: number[]
    sectorTagId?: number
    makerSelfLabel: string[]
  }
  type Result = MakerInfo
}
declare namespace GetMakerProducts {
  interface Params {
    pageNo?: number
    pageSize?: number
    makerId: number
  }
  interface Result {
    list: Product.ProductItem[]
    total: number
  }
}
declare namespace GetDesignerExits {
  interface Params {
    designerId: string
  }
}
