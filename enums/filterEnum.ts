import { generatorConstant } from "@/utils"

// 推荐类型
export const FILTER_RECOMMEND_ENUM = generatorConstant([
  {
    ALL: { label: "全部", value: false }
  },
  {
    EDITOR: { label: "编辑推荐", value: true }
  }
])
// 排序字段
export const FILTER_SORT_ENUM = generatorConstant([
  {
    SALES_BEST: { label: "请选择", value: -1, disabled: true }
  },
  {
    SALES_BEST: { label: "销量最好", value: 0 }
  },
  {
    LAST_UPLOAD: { label: "最新上传", value: 1 }
  },
  {
    TOP_VIEW: { label: "浏览最多", value: 2 }
  },
  {
    TOP_FAVORITE: { label: "收藏最多", value: 3 }
  },
  {
    TOP_DOWNLOAD: { label: "下载最多", value: 4 }
  },
  {
    TOP_COMMENT: { label: "评论最多", value: 5 }
  }
])
// 价格排序
export const SORT_PRICE_ENUM = generatorConstant([
  {
    ASC: { label: "价格从低到高", value: false }
  },
  {
    DESC: { label: "价格从高到低", value: true }
  }
])
// 版权价格
export const FILTER_COPYRIGHT_ENUM = generatorConstant([
  {
    PERSONAL: { label: "个人授权价格", value: 0 }
  },
  {
    COMPANY: { label: "企业授权价格", value: 1 }
  },
  {
    COPYRIGHT: { label: "版权售出价格", value: 2 }
  }
])
// 格式
export const FILTER_FORMAT_ENUM = generatorConstant([
  {
    ALL: { label: "全部格式", value: 0 }
  },
  {
    GLB: { label: "glb", value: 1 }
  },
  {
    GLTF: { label: "gltf", value: 2 }
  }
])
// 面
export const FILTER_SURFACE_ENUM = generatorConstant([
  {
    ALL: { label: "全部", value: 0 }
  },
  {
    DOWN_5: { label: "5k以下", value: 1 }
  },
  {
    BETWEEN_5_10: { label: "5k-10k", value: 2 }
  },
  {
    BETWEEN_10_30: { label: "10k-30k", value: 3 }
  },
  {
    BETWEEN_30_100: { label: "30k-100k", value: 4 }
  },
  {
    UP_100: { label: "100k以上", value: 5 }
  }
])
// 其他筛选信息
export const FILTER_OTHER_ENUM = generatorConstant([
  {
    FREE: { label: "免费", value: 1 }
  },
  {
    PBR: { label: "PBR", value: 2 }
  },
  {
    ANIMATION: { label: "有动画", value: 3 }
  },
  {
    TIP_PIC: { label: "有贴图", value: 4 }
  }
])

// 限量资产
export const FILTER_LIMIT_ASSET = {
  // 最多交易/最多查看
  RANK_TYPE: generatorConstant([
    {
      DEAL: { label: "最多交易", value: 1 }
    },
    {
      VIEW: { label: "最多查看", value: 2 }
    }
  ]),
  // 按时间筛选
  TIME_TYPE: generatorConstant([
    {
      ONE_HOUR: { label: "1小时", value: 3600 }
    },
    {
      SIX_HOUR: { label: "6小时", value: 21600 }
    },
    {
      TWENTY_FOUR_HOUR: { label: "24小时", value: 86400 }
    },
    {
      SEVEN_DAY: { label: "7天", value: 604800 }
    },
    {
      THIRTY_DAY: { label: "30天", value: 2592000 }
    }
  ]),
  // 热卖/最新
  LIST_TYPE: generatorConstant([
    {
      HOT: { label: "热卖限量资产", value: 1 }
    },
    {
      NEW: { label: "最新限量资产", value: 2 }
    }
  ])
}
