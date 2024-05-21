// ? 全局默认配置项

export const downloadHost = "http://meta3dlocal.oss-cn-hangzhou.aliyuncs.com"

// 默认头像
// export { default as defaultAvatar } from "@/assets/images/user-default.png"

// // 默认错误图片
// export { default as defaultErrImg } from "@/assets/images/image-error.png"

// 首页地址（默认）
export const HOME_URL = "/home/index"
export const BASE_URL = "http://192.168.110.191:48087"

// 登录页地址（默认）
export const LOGIN_URL = "/login"

// 默认主题颜色
export const DEFAULT_PRIMARY = "#115ee8"

// 路由白名单地址（本地存在的路由 staticRouter.ts 中）
export const ROUTER_WHITE_LIST = ["/500"]

// const USER_CENTER = "/user-center"
// 首页菜单路由
export const INDEX_ROUTE = {
  HOME: "/home", // 首页
  ASSET: "/asset", // 资产
  DESIGNER: "/designer", // 设计师
  LIMIT_ASSET: "/limit-asset", // 限量资产
  BUSINESS_DOCK: "/bussiness-dock", // 商业对接
  BUSINESS_DOCK_DETAIL: "/bussiness-dock-detail", // 商业对接详情
  UPLOAD_WORK: "/upload", // 商业对接
  WORKS: "/works", // 商业对接
  ORDER_DETAIL: "/order-detail", // 商业对接
  USER_UPLOAD_RECORD: "/record", // 上传记录
  USER_CENTER: "/user-center", // 个人中心
  USER_PRODUCTS: "products", // 个人中心-作品
  USER_ORDER_LIST: "order-list", // 个人中心-订单
  EnterpriseInfo: "enterprise-info", // 个人中心-企业信息
  USER_LIMIT_ASSET: "limit-asset", // 个人中心-限量藏品
  USER_LIMIT_ASSET_QUERY: "query", // 个人中心-限量藏品-查询
  USER_LIMIT_ASSET_QUERY_ACCOUNT: "account", // 个人中心-限量藏品-查询账户
  USER_LIMIT_ASSET_QUERY_COLLECTION: "collection", // 个人中心-限量藏品-查询藏品
  ADD: "/add",
  EDIT: "/edit",
  UPLOAD: "/upload"
}
