// 没有token也允许访问的界面
export const NO_AUTH_PAGES = [
  "/upload",
  "/user-center",
  "/user/auth-personal",
  "/user/auth-company",
  "/user/set-info",
  "/user/choose-preference"
]

export const NO_FOOTER_PAGES = ["upload", "works", "user-center", `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`, "asset-editor"]
export const NO_HEADER_PAGES = ["upload", "works", `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`, "asset-editor"]

// 默认的头像与错误图
export const DEFAULT_ERROR_IMG = "/images/image-error.svg"
export const DEFAULT_AVATAR_IMG = "/images/user-default.png"

export const SEARCH_ITEMS = [
  {
    id: 1,
    key: "product",
    name: "作品"
  },
  {
    id: 2,
    key: "designer",
    name: "设计师"
  },
  {
    id: 3,
    key: "",
    name: "限量资产"
  },
  {
    id: 4,
    key: "",
    name: "制造商"
  }
]
