/**
 * @name 获取城市列表
 */
export const getAreaApi = () => {
  return http.get<System.City[]>(`${APP}/member/area/tree`, { loading: false })
}

/**
 * @name 获取 行业/推荐 列表
 */
export const getListByTypeApi = (params: System.ListByType) => {
  return http.get<System.ResListByType[]>(`${APP}/member/tag/record/list-by-type`, params, { loading: false })
}
