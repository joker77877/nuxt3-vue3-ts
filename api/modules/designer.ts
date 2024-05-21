/**
 * @name 获取设计师详情
 */
export const getProductDesignerInfo = (id: number) => {
  return http.get<Designer.DesignerInfo>(`${APP}/member/designer/get`, { id }, { hideErrorTips: true })
}

/**
 * @name 关注设计师
 */
export const followDesigner = (designerId: string) => {
  return http.post(`${APP}/member/designer/create`, { designerId })
}

/**
 * @name 取关设计师
 */
export const cancelFollowDesigner = (designerId: string) => {
  return http.delete(`${APP}/member/designer/delete`, { designerId })
}

/**
 * @name 作品模块
 */
// 获取未关注的设计师
export const getRecommendDesignerList = () => {
  return http.get<Array<Designer.ResDesignerItem>>(`${APP}/product/home/page/noAttention/list`)
}
