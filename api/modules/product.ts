// 更新作品封面图
export const updateSpuPicUrl = (params: any) => {
  return http.post<boolean>(`${APP}/infra/file/resource/update/spuPicUrl`, params)
}

// 更新模型配置信息
export const updateSpuModelConfig = (params: Product.ReqUpdateModelConfig) => {
  return http.post<boolean>(`${APP}/infra/file/resource/update/edit-info`, params)
}
/**
 * @name 作品模块
 */
// 获取推荐作品列表
export const getRecommendProductList = () => {
  return http.get<Array<Product.ProductItem>>(`${APP}/product/home/page/recommend/list`, { pageSize: 24, pageNo: 1 })
}

// 搜索3D资产
export const searchAssets = (params: Product.ReqSearchProduct) => {
  const p = excludeProperty(params, "other")
  const { other } = params
  // 如果有子类，则父类的内容不传给后端，为空数组,否则传父类
  let cid: any[]
  if (p.subCategoryIds && p.subCategoryIds > -1) {
    cid = []
  } else if (p.categoryIds && p.categoryIds > -1) {
    cid = [p.categoryIds]
  } else {
    cid = []
  }
  const isHave = (arr: number[] | null | undefined, key: number) => {
    if (!Array.isArray(arr)) return false
    const index = arr.findIndex((item) => item === key)
    return index > -1
  }
  const req = {
    ...p,
    categoryIds: cid,
    subCategoryIds: p.subCategoryIds && p.subCategoryIds > -1 ? [p.subCategoryIds] : [],
    chooseFree: isHave(other, FILTER_OTHER_ENUM.FREE),
    choosePbr: isHave(other, FILTER_OTHER_ENUM.PBR),
    chooseAnimation: isHave(other, FILTER_OTHER_ENUM.ANIMATION),
    chooseTipPic: isHave(other, FILTER_OTHER_ENUM.TIP_PIC)
  }
  return http.get<Product.ResSearchProduct>(`${APP}/product/search/spu`, req)
}

// 搜索设计师
export const searchDesigner = (params: Designer.ReqSearchDesigner) => {
  return http.get<Designer.ResSearchDesigner>(`${APP}/product/search/designer`, params)
}

// 获取3D资产详情
export const getProductDetail = (id: string) => {
  return http.get<Product.ProductDetail>(`${APP}/product/spu/get-detail`, { id })
}

// 获取限量资产详情
export const getLimitAssetDetail = (id: string) => {
  return http.get<Product.ProductDetail>(`${APP}/product/spu/get-limited-detail`, { id })
}

// 获取3D资产评论
export const getProductComment = (params: Product.ReqProductCommentPage) => {
  return http.get<Product.ResProductComment>(`${APP}/product/comment/page`, params)
}

// 获取详情页分享模式下的推荐列表
export const getProductRecommendList = (spuId: number) => {
  return http.get<Product.RecommendItem[]>(`${APP}/product/spu/recommend`, { spuId })
}

// 获取产品购买状态
export const getProductBuyState = (params: Product.ReqProductBuyState) => {
  return http.post<Product.ResProductBuyState>(`${APP}/product/spu/buy-state`, params)
}

// 获取3D资产文件相关
export const getProductResourceInfo = (id: string) => {
  return http.get<Product.ResProductResourceInfo>(`${APP}/product/file/get-resource-info`, { productId: id })
}

// 作品添加评论
export const publishProductComment = (params: Product.ReqProductComment) => {
  return http.post(`${APP}/product/comment/create`, params)
}

// 收藏作品
export const favoriteProduct = (spuId: number) => {
  return http.post(`${APP}/product/favorite/create`, { spuId })
}

// 取消收藏作品
export const cancelFavoriteProduct = (spuId: number) => {
  return http.delete(`${APP}/product/favorite/delete`, { spuId })
}

// 获取资产交易记录
export const getProductOrderList = (spuId: number) => {
  return http.get(`${APP}/product/spu/product-order-list`, { spuId })
}

// 获取精品3D资产列表
export const getPremiumProductList = (params?: ReqPage) => {
  let ids = [1, 2, 3]
  return http.get<Array<Product.ProductItem>>(`${APP}/product/home/page/premium/list`, { ids, ...params })
}

// 获取最新上传资产列表
export const getLastUploadProductList = (params?: ReqPage) => {
  return http.get<ResPage<Product.ProductItem>>(`${APP}/product/home/page/condition/list`, { conditionType: 1, ...params })
}

export const DownloadFile = (url: string) => {
  return http.get(
    url,
    {},
    {
      responseType: "blob"
    }
  )
}

// 获取资产下载列表信息
export const getProductFileList = (params: Product.ReqDownloadList) => {
  return http.post<Array<Product.ResDownloadList>>(`${APP}/product/save/down/load/record`, params)
}

// 获取下载排行资产列表
export const getTopUploadProductList = (params?: ReqPage) => {
  return http.get<ResPage<Product.ProductItem>>(`${APP}/product/home/page/condition/list`, { conditionType: 3, ...params })
}
// 获取最热门资产列表
export const getTopPopularProductList = (params?: ReqPage) => {
  return http.get<ResPage<Product.ProductItem>>(`${APP}/product/home/page/condition/list`, { conditionType: 2, ...params })
}
// 获取关注资产列表
export const getAttentionProductList = (params?: ReqPage) => {
  return http.get<Array<Product.ProductItem>>(`${APP}/product/home/page/attention/list`, params)
}

// 3d资产首页根据条件筛选列表
export const get3DAssertListByFilters = (params: Product.ReqAssertListByFilters) => {
  const {
    pageNo,
    pageSize,
    categoryIds,
    subCategoryIds,
    recommend,
    sortFieldType,
    sortPriceFieldType,
    sortAsc,
    startPrice,
    endPrice,
    format,
    priceType,
    surfaceCount,
    other = []
  } = params
  let sortFieldTypeTemp = sortFieldType
  if (sortPriceFieldType && sortFieldType === -1) {
    sortFieldTypeTemp = sortPriceFieldType
  }
  // 如果有子类，则父类的内容不传给后端，为空数组,否则传父类
  // eslint-disable-next-line no-nested-ternary
  const cid = subCategoryIds && subCategoryIds > -1 ? [] : categoryIds && categoryIds > -1 ? [categoryIds] : []
  const isHave = (arr: number[] | null, key: number) => {
    if (!Array.isArray(arr)) return false
    const index = arr.findIndex((item) => item === key)
    return index > -1
  }
  const req = {
    pageNo,
    pageSize,
    categoryIds: cid,
    subCategoryIds: subCategoryIds && subCategoryIds > -1 ? [subCategoryIds] : [],
    recommend,
    sortFieldType: sortFieldTypeTemp,
    sortAsc,
    startPrice,
    endPrice,
    format,
    priceType,
    surfaceCount,
    chooseFree: isHave(other, FILTER_OTHER_ENUM.FREE),
    choosePbr: isHave(other, FILTER_OTHER_ENUM.PBR),
    chooseAnimation: isHave(other, FILTER_OTHER_ENUM.ANIMATION),
    chooseTipPic: isHave(other, FILTER_OTHER_ENUM.TIP_PIC)
  }
  return http.get<Product.ResAssertListByFilters>(`${APP}/product/spu/query`, req)
}

// 3d资产分类-获取一级菜单
export const getCategoryOfProduct = () => {
  return http.get<Array<Product.ResProductCategory>>(`${APP}/product/category/list`)
}
// 3d资产分类-获取二级菜单
export const getSubCategoryOfProduct = (id: Array<number>) => {
  return http.get<Array<Product.ResProductCategory>>(`${APP}/product/category/list-by-ids`, { ids: id })
}

// 添加购物车
export const addProductToCart = (params: Product.ReqAddProductToCart) => {
  return http.post<number>(`${APP}/trade/cart/add`, params)
}
// 删除购物车中的作品
export const delProductOfCart = (params: Array<number>) => {
  return http.delete<number>(`${APP}/trade/cart/delete`, null, { ids: params })
}
// 获取购物车作品
export const getProductOfCart = () => {
  return http.get<Product.ResCartProduct>(`${APP}/trade/cart/list`)
}
// 创建订单
export const createOrder = (params: Product.ReqCreateOrder) => {
  return http.post<Product.ResCreateOrder>(`${APP}/trade/order/create`, params)
}
// 根据订单id获取详情
export const getOrderDetail = (id: number) => {
  return http.get<Product.ResOrderDetail>(`${APP}/trade/order/get-detail`, { id })
}
// 付款
export const submitOrder = (params: Product.ReqSubmitOrder) => {
  return http.post<Product.ResSubmitOrder>(`${APP}/pay/order/submit`, params)
}
// 获得余额
export const getBalance = () => {
  return http.get<Product.ResBalance>(`${APP}/pay/wallet/get`)
}
// 更改授权方式
export const updateCopyright = (params: Product.ReqUpdateCopyRight) => {
  return http.post<number>(`${APP}/trade/cart/updateRightType`, params)
}
// 获取支付方式
export const getEnablePay = async () => {
  const res = await http.get<Product.ResPayWay[]>(`${APP}/pay/channel/get-enable-code-list`, { appId: 1 })
  return res.map((item) => ({ label: item.channelName, value: item.code, payTypeCode: item.payTypeCode, selected: false }))
}
// 获取订单支付状态
export const getPayStatus = async (id: string) => {
  return http.get<Product.ResPayStatus>(`${APP}/pay/order/get`, { id })
}
