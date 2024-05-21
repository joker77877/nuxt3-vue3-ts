// 用户角色
export enum UserRoles {
  PERSONAL = 1,
  DESIGNER = 2,
  ARTIST = 3,
  MAKER = 4
}

// 用户类型
export enum UserType {
  PERSONAL = 1,
  COMPANY = 2
}

// 用户实名认证状态
export enum UserCertificationStatus {
  /**
   * @description: 未认证
   */
  UN_AUTH = "UN_AUTH",
  /**
   * @description: 审核通过
   */
  PASS = "PASS",
  /**
   * @description: 审核未通过
   */
  NO_PASS = "NO_PASS",
  /**
   * @description: 审核中
   */
  PASSING = "PASSING",
  /**
   * @description: 认证已过期
   */
  EXPIRED = "EXPIRED"
}
export const USER_ROLES = ["", "", "设计师", "艺术家", "制造商"]

// 用户登录弹窗类型
export enum PopupTypeEnum {
  LOGIN,
  REGISTER,
  FORGET_PASSWORD,
  BIND_PHONE
}

export enum UserTagsType {
  /**
   * @description: 商品
   */
  Commodity = 1,
  /**
   * @description: 行业
   */
  Industry,
  /**
   * @description: 服务
   */
  Service
}

/**
 * 用户认证状态
 */
export enum UserAuthEnum {
  /**
   * 未申请
   */
  UN_AUTH = "未实名认证",
  "未实名认证" = "UN_AUTH",
  /**
   * 审核通过
   */
  PASS = "已实名认证",
  "已实名认证" = "PASS",
  /**
   * 审核未通过
   */
  NO_PASS = "实名未通过",
  "实名未通过" = "NO_PASS",
  /**
   * 审核中
   */
  PASSING = "实名认证待审核",
  "实名认证待审核" = "PASSING",
  /**
   * 认证已过期
   */
  EXPIRED = "实名已过期",
  "实名已过期" = "EXPIRED"
}
