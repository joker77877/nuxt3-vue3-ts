/**
 * @description: 获取资产列表
 * @param {GetSpuList} params
 * @return {*}
 */
export const getSpuList = (params: GetSpuList.Params) => {
  return http.get<GetSpuList.Result>(`${APP}/member/spu/list`, params)
}

/**
 * @description: 获取订单列表
 * @param {GetOrderList} params
 * @return {*}
 */
export const getOrderList = (params: GetOrderList.Params) => {
  return http.get<GetOrderList.Result>(`${APP}/trade/order/page`, params)
}
/**
 * @description: 获取订单详情
 * @param {GetWorksOrderDetail} params
 * @return {*}
 */
export const getWorksOrderDetail = (params: GetWorksOrderDetail.Params) => {
  return http.get<GetWorksOrderDetail.Result>(`${APP}/trade/order/get-detail`, params)
}

/* 上下架资产 */
export const updateProductStatus = (params: UpdateProductStatus.Params) => {
  return http.put<UpdateProductStatus.Result>(`${APP}/member/spu/update/status`, params)
}

/**
 * @description: 获取上传作品列表
 * @param {GetOrderList} params
 * @return {*}
 */
export const getUploadRecord = (params: UpLoadRecord.Params) =>
  http.get<UpLoadRecord.Result>(`${APP}/member/spu/file-resource-list`, params)
