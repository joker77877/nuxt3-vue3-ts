export const USER_CENTER_MENUS_MAP = {
  product: `${INDEX_ROUTE.USER_CENTER}/${INDEX_ROUTE.USER_PRODUCTS}`,
  orderList: `${INDEX_ROUTE.USER_CENTER}/${INDEX_ROUTE.USER_ORDER_LIST}`,
  enterpriseInfo: `${INDEX_ROUTE.USER_CENTER}/${INDEX_ROUTE.EnterpriseInfo}`,
  limitAsset: `${INDEX_ROUTE.USER_CENTER}/${INDEX_ROUTE.USER_LIMIT_ASSET}`
}

export const USER_CENTER_MENUS = [
  {
    label: "企业信息",
    icon: IconEnterprise,
    key: USER_CENTER_MENUS_MAP.enterpriseInfo
  },
  {
    label: "限量藏品",
    icon: IconCollection,
    key: USER_CENTER_MENUS_MAP.limitAsset
  },
  {
    label: "作品",
    icon: IconWorks,
    key: USER_CENTER_MENUS_MAP.product
  },
  {
    label: "收藏",
    icon: IconCollect,
    key: ""
  },
  {
    label: "关注",
    icon: IconFollow,
    key: ""
  },
  {
    label: "消息",
    icon: IconInformation,
    key: ""
  },
  {
    label: "我的订单",
    icon: IconOrder,
    key: USER_CENTER_MENUS_MAP.orderList
  },
  {
    label: "我的售出",
    icon: IconCart,
    key: ""
  },
  {
    label: "收支明细",
    icon: IconDetail,
    key: ""
  },
  {
    label: "充值",
    icon: IconRecharge,
    key: ""
  },
  {
    label: "提现",
    icon: iconDrawing,
    key: ""
  },
  {
    label: "版权",
    icon: IconCopyright,
    key: ""
  },
  {
    label: "账户设置",
    icon: iconSettings,
    key: ""
  }
]

export const USER_PRODUCTS_TABS = [
  {
    label: "发布成功",
    name: ProductListStateEnum.ENABLE,
    icon: ""
  },
  {
    label: "待审核",
    name: ProductListStateEnum.CHECKING,
    icon: ""
  },
  {
    label: "草稿",
    name: ProductListStateEnum.DRAFT,
    icon: ""
  },
  {
    label: "已下架",
    name: ProductListStateEnum.DISABLE,
    icon: ""
  }
]

export const USER_ORDER_TABS = [
  {
    label: "所有订单",
    name: -1
  },
  {
    label: "待付款",
    name: OrderTypeEnum.UnPaid
  },
  {
    label: "已完成",
    name: OrderTypeEnum.Completed
  }
]
export const ProductUpdateState = {
  [ProductListStateEnum.RECYCLE]: {
    value: ProductListStateEnum.ENABLE,
    label: "下架",
    tagText: ""
  },
  [ProductListStateEnum.DISABLE]: {
    value: ProductListStateEnum.ENABLE,
    label: "上架",
    tagText: "已下架"
  },
  [ProductListStateEnum.DRAFT]: {
    value: ProductListStateEnum.ENABLE,
    label: "上架",
    tagText: "草稿"
  },
  [ProductListStateEnum.CHECKING]: {
    value: ProductListStateEnum.ENABLE,
    label: "上架",
    tagText: "作品待审核"
  },
  [ProductListStateEnum.ENABLE]: {
    value: ProductListStateEnum.DISABLE,
    label: "下架",
    tagText: ""
  },
  [ProductListStateEnum.COPYRIGHT_ON_SALE]: {
    value: ProductListStateEnum.DISABLE,
    label: "下架",
    tagText: ""
  },
  [ProductListStateEnum.COPYRIGHT_SALE_OUT]: {
    value: ProductListStateEnum.DISABLE,
    label: "下架",
    tagText: ""
  }
}
/* 授权map */
export const RightTypeMap = {
  [RightTypeEnum.Personal]: { label: "个人授权" },
  [RightTypeEnum.Enterprise]: { label: "企业授权" },
  [RightTypeEnum.Copyright]: { label: "版权售出" }
}

export const OrderStatusEnum = generatorConstant([
  {
    UnPaid: { label: "等待买家付款", value: 0 }
  },
  {
    UnDelivered: { label: "待发货", value: 10 }
  },
  {
    Delivered: { label: "已发货", value: 20 }
  },
  {
    Completed: { label: "购买成功", value: 30 }
  },
  {
    Canceled: { label: "交易关闭", value: 40 }
  }
])
// 限量藏品tabs
export const USER_LIMIT_TAB = [
  {
    label: "藏品管理",
    value: ProductListStateEnum.ENABLE
  },
  {
    label: "待审核",
    value: ProductListStateEnum.CHECKING
  },
  {
    label: "草稿",
    value: ProductListStateEnum.DRAFT
  },
  {
    label: "已下架",
    value: ProductListStateEnum.DISABLE
  }
]

export const bussinessDockFilterOptions = [
  {
    label: "浏览量最高",
    value: 0
  },
  {
    label: "降序排列",
    value: 1
  }
]

/**
 * 用户认证状态
 */
// export const UserAuthEnum = generatorConstant([
//   {
//     UN_AUTH: { label: "未实名认证", value: "UN_AUTH" }
//   },
//   {
//     PASS: { label: "已实名认证", value: "PASS" }
//   },
//   {
//     NO_PASS: { label: "已实名认证", value: "NO_PASS" }
//   },
//   {
//     PASSING: { label: "实名认证待审核", value: "PASSING" }
//   },
//   {
//     EXPIRED: { label: "实名已过期", value: "EXPIRED" }
//   }
// ])
