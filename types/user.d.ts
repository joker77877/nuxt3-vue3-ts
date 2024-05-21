declare namespace User {
  // 实名认证
  interface ReqRealName {
    userName: string
    cardNo: string
    cardUrl0: string
    cardUrl1: string
    chargeName: string // 运营者姓名
    chargeCardNo: string // 运营者身份证号
    enterCertifLetterUrl: string // 企业认证申请公函
    enterpriseMail: string // 企业邮箱
    mobile: string
    code: string
  }
  interface ResLogin {
    userId: number
    accessToken: string
    refreshToken: string
    expiresTime: number
    openid: number
  }
  interface ReqUserParams extends ReqPage {
    username: string
    gender: number
    idCard: string
    email: string
    address: string
    createTime: string[]
    status: number
  }
  interface ResUserList {
    id: string
    username: string
    gender: number
    user: { detail: { age: number } }
    idCard: string
    email: string
    address: string
    createTime: string
    status: number
    avatar: string
    photo: any[]
    children?: ResUserList[]
  }
  interface ResStatus {
    userLabel: string
    userValue: number
  }
  interface ResGender {
    genderLabel: string
    genderValue: number
  }
  interface ResDepartment {
    id: string
    name: string
    children?: ResDepartment[]
  }
  interface ResRole {
    id: string
    name: string
    children?: ResDepartment[]
  }
  interface SetBaseInfo {
    avatar?: string
    nickname: string
    userType: number
    userRole?: number
    industry?: number
    areaId?: number
  }
  interface SetProfession {
    tags: Number[]
  }
  interface MemberTagItem {
    name: string
    tagType: number
    tagTypeId: number
    id: number
    createTime: number
    picUrl: null | string
  }

  interface UserInfo {
    nickname: string
    avatar: string
    mobile: string
    sex: null
    point: number
    experience: number
    level: null
    fansNum: number
    attentionNum: number
    makerFlag: true
    browseCount: number
    brokerageEnabled: null
    userType: number
    registrationStatus: number
    userRole: number
    industry: number
    areaId: number
    areaIds: number[]
    areaName: string
    ignoreInfo: number
    ignoreBindMobile: number
    tagIds: number[]
    memberTagList: MemberTagItem[]
    authStatus: keyof typeof UserCertificationStatus
  }
  interface Tag {
    name: string
    tagType: number
    tagTypeId: number
    id: number
    createTime: number
    picUrl: null
  }

  interface UserAuthInfo {
    id: string
    userName: string
    cardNo: string
    cardUrl0: string
    cardUrl1: string
    chargeName: null
    chargeCardNo: null
    enterCertifLetterUrl: string
    enterpriseMail: null
    status: keyof typeof UserCertificationStatus
  }
}
