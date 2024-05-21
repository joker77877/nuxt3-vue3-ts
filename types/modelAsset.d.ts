// 过滤条件
interface FilterConditionInterface {
  recommend: boolean
  sortFieldType: number
  sortPriceFieldType?: number
  priceType?: number
  sortAsc: boolean
  startPrice: number | null
  endPrice: number | null
  format: number
  surfaceCount: number
  other: Array<number>
}
// 价格过滤条件
interface FilterPriceInterface {
  type?: number // 默认为6，代表按价格排序
  startPrice: number | null
  endPrice: number | null
  sortAsc: boolean
}
// 类型
interface FilterTypeInterface {
  categoryIds: number | undefined
  subCategoryIds: number | undefined
}
interface CopyrightTabItem {
  id: number
  key: string
  name: string
  price: string
}

interface OptionItem {
  id: number
  name?: string
  thumbnailUrl?: string
  url?: string
}

interface ModelConfigItem {
  title?: string
  subTitle?: string
  key: string
  icon?: any
  disabled?: boolean
  category?: string
  className?: string
  tips?: string
  activeCollapse?: string[]
  type?: "checkbox" | "collapse" | "slider" | "color" | "big-color" | "link" | "tab" | "tab-pane" | "select-list" | "select-img"
  tabType?: "border-card" | "card"
  options?: OptionItem[]
  linkTarget?: any
  optionsTitle?: string
  selectedOption?: OptionItem
  selectedOptionId?: number
  activeTab?: string
  text?: string | (() => string) // 指定link类型的展示内容
  targetNodeVal?: any // 用于渲染link类型显示其他节点的指定内容
  value?: any
  hide?: boolean
  enable?: boolean
  min?: number
  max?: number
  step?: number
  children?: ModelConfigItem[]
  changeHandle?: (engine: Meta3DEngineType, value: any, data?: ModelConfigItem) => void
}
