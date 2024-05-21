import { generatorConstant } from "@/utils"

// 推荐类型
export const DESIGNER_FILTER_RECOMMEND_ENUM = generatorConstant([
  {
    ALL: { label: "全部", value: false }
  },
  {
    DESIGNER: { label: " Meta推荐设计师", value: true }
  }
])
// 其他筛选信息
export const DESIGNER_FILTER_OTHER_ENUM = generatorConstant([
  {
    VIEW_VOLUMES: { label: "浏览量最高", value: 0 }
  },
  {
    FANS_VOLUMES: { label: "粉丝量最高", value: 1 }
  }
])
