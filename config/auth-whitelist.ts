// 需要用户登录，但登录失败不拉起登录弹窗的api
// 支持 字符串全匹配("/app-api/product/spu/buy-state") 和 正则匹配(/\/app-api\/product\/spu\/buy-state/)
export const AUTH_WHITE_LIST = ["/product/spu/buy-state", "/member/designer/exits"]
