export const getMakerList = (params: GetMakerList.Params) => {
  return http.get<GetMakerList.Result>(`${APP}/member/user/maker/get/list`, params)
}
/**
 * @description: 创建制造商
 * @param {UpdateMaker} params
 * @return {*}
 */
export const createMaker = (params: UpdateMaker.Params) => {
  return http.post<UpdateMaker.Result>(`${APP}/member/user/maker/create`, params)
}
/**
 * @description: 更新制造商
 * @param {UpdateMaker} params
 * @return {*}
 */
export const updateMaker = (params: UpdateMaker.Params) => {
  return http.post<UpdateMaker.Result>(`${APP}/member/user/maker/update`, params)
}

/**
 * @description: 获取制造商详情
 * @param {GetMakerDetail} params
 * @return {*}
 */
export const getMakerDetail = (params?: GetMakerDetail.Params) => {
  return http.get<GetMakerDetail.Result>(`${APP}/member/user/maker/get/detail`, params)
}

/**
 * @description: 获取制造商作品
 * @param {GetMakerProducts} params
 * @return {*}
 */
export const getMakerProducts = (params?: GetMakerProducts.Params) => {
  return http.get<GetMakerProducts.Result>(`${APP}/product/spu/maker/recommend`, params)
}
/**
 * @description: 获取是否关注制造商
 * @param {GetMakerDetail} params
 * @return {*}
 */
export const getDesignerExits = (params: GetDesignerExits.Params) => {
  return http.get<boolean>(`${APP}/member/designer/exits`, params)
}
