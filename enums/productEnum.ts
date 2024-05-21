import { generatorConstant } from "@/utils"

export enum ProductStatus {
  NORMAL, // 正常可购买
  PAYING, // 待支付，快去支付
  SELLING, // 版权售卖中
  SELL, // 版权已售卖，无法购买
  DOWNLOAD // 可以下载
}

export enum ProductType {
  ASSETS = 1, // 模型
  DESIGNER = 2, // 设计师
  LIMITED_ASSETS = 3, // 限量资产
  MAKER = 4 // 制造商
}

export enum ProductSpuType {
  ASSET = 1, // 普通资产
  LIMIT = 2, // 限量资产
  ALL = 3 // 都有
}

export enum ProductDownloadType {
  NORMAL = 1, // 正常下来
  EMAIL = 2 // 通过邮箱下载
}

// 详情页版权展示tab
export enum ProductCopyRightType {
  NORMAL = 1, // 个人授权范围
  COMPANY = 2, // 企业授权范围
  COPYRIGHT = 3 // 作品版权范围
}

export enum ProductPublishType {
  NORMAL = 1, // 作品出售
  FREE = 2, // 免费下载
  SHARE = 3 // 只分享不支持下载
}

export enum ProductCodeState {
  DRAFT = 1008005006, // 作品SPU处于草稿状态
  REVIEW = 1008005007, // 作品SPU处于审核状态
  SELF_OFF_SHELF = 1008005008, // 作品SPU处于下架并且该SPU版权属于该用户状态
  OFF_SHELF = 1008005009, // 作品SPU处于下架状态
  NON_EXISTENT = 1008005000 // 作品 SPU 不存在
}
// 订单状态
export const PAY_ORDER_STATUS_ENUM = generatorConstant([
  {
    WAITING: { label: "未支付", value: 0 }
  },
  {
    SUCCESS: { label: "支付成功", value: 10 }
  },
  {
    REFUND: { label: "已退款", value: 20 }
  },
  {
    CLOSED: { label: "支付关闭", value: 30 }
  }
])
// 授权类型
export const COPYRIGHT_TYPE_ENUM = generatorConstant([
  {
    PERSONAL_AUTH: { label: "个人授权", value: 1 }
  },
  {
    ENTERPRISES_AUTH: { label: "企业授权", value: 2 }
  },
  {
    COPYRIGHT_SALE: { label: "版权出售", value: 3 }
  }
])

// 作品状态
export const PRODUCT_STATUS_ENUM = generatorConstant([
  {
    DELETED: { label: "已删除", value: -1 }
  },
  {
    DISABLE: { label: "下架", value: 0 }
  },
  {
    DRAFT: { label: "草稿", value: 1 }
  },
  {
    CHECKING: { label: "待审核", value: 2 }
  },
  {
    ENABLE: { label: "上架", value: 3 }
  },
  {
    COPYRIGHT_ON_SALE: { label: "版权售出中", value: 4 }
  },
  {
    COPYRIGHT_SALE_OUT: { label: "版权已售出", value: 5 }
  }
])
export const PAY_WAYS_ENUM = generatorConstant([
  {
    WALLET: { label: "觅她币", value: "wallet" }
  },
  {
    ALIPAY_PC: { label: "支付宝支付", value: "alipay_pc" }
  },
  {
    WX: { label: "微信支付", value: "wx_bar" }
  }
])
export enum AssetTypeEnum {
  NORMAL = 1, // 普通3D资产
  LIMITED = 2, // 限量资产
  BOTH = 3 // 两者都有，限量资产可以出售使用权
}

export enum AssetStatusEnum {
  DISABLE = ProductListStateEnum.DISABLE, // 下架
  DRAFT = ProductListStateEnum.DRAFT, // 草稿
  CHECKING = ProductListStateEnum.CHECKING, // 审核中
  NORMAL = ProductListStateEnum.ENABLE // 上架
}

// 资产推荐枚举
export enum AssetRecommendEnum {
  HOME = 1, // 首页
  ASSET, // 3d资产
  DESIGNER, // 设计师
  LIMIT // 限量资产
}
