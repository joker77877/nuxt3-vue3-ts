// 设计师
declare namespace Designer {
  // 过滤条件
  interface FilterConditionInterface {
    recommend: boolean
    industryId: number
    areaId: number
    sortFieldType: number
  }

  interface DesignerInfo {
    id: number
    nickname: string
    status: number
    avatar: string
    areaId: number
    areaName: string
    userRole: number
    mobile: string
    attention: boolean
    attentionNum: number
    fansNum: number
  }
  interface ResDesignerItem {
    id: number
    picUrl: string // 资产封面图
    creatorId: number
    creator: string // 设计师名称
    attentionCount: number // 粉丝数量
    moduleCount: number // 模型数量
    creatorUrl: string // 设计师头像
    favorite: boolean
    designer: boolean // 是否关注
  }

  interface ReqSearchDesigner {
    pageNo: number
    pageSize: number
    recommend?: boolean
    industryIds?: number
    areaIds?: number
    keyword?: string
    sortFieldType?: number
    recentWorksNum?: number
  }

  interface ResSearchDesigner {
    list: DesignerItem[]
    total: number
  }

  interface SearchDesignerItem {
    id: string
    nickname: string
    name: string
    status: number
    avatar: string
    mobile: string
    attention: boolean
    attentionNum: number
    fansNum: number
    worksNum: number
    cityName: string
    levelName: string
    recentWorks: Product.ProductItem[]
    areaName: string
    self: boolean // 设计师是否为当前登录用户
    worksCount: number // 设计师作品数
  }
  interface DesignerItem {
    id: number
    nickname: string
    name: string
    status: number
    avatar: string
    mobile: string
    attention: boolean
    attentionNum: number
    fansNum: number
    worksNum: number
    cityName: string
    levelName: string
    recentWorks: string
  }
}
