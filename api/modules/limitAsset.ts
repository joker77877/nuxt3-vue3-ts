// 限量资产甄选
export const getLimitAssetSelect = (params: LimitAssetSelect.Params) =>
  http.get<LimitAssetSelect.Result>(`${APP}/product/limited/queryBySelect`, params)

// 限量资产前三排行
export const getLimitAssetRank = (params: LimitAssetRank.Params) =>
  http.get<LimitAssetRank.Result>(`${APP}/product/limited/queryMostSpuByTime`, params)

// 限量资产列表
export const getLimitAssetList = (params: LimitAssetList.Params) =>
  http.get<LimitAssetList.Result>(`${APP}/product/limited/page`, params)

// 查询区块链账户
export const queryBlackChainAccount = (params: BlockChainAccount.Params) =>
  http.get<BlockChainAccount.Result>(`${APP}/blockchain/account/get`, params)

// 查询区块链账户下的藏品
export const queryBlackChainCollections = (params: BlockChainCollections.Params) =>
  http.get<BlockChainCollections.Result>(`${APP}/blockchain/nft/collection/page`, params)

// 查询藏品详情
export const queryCollectionDetail = (params: CollectionDetail.Params) =>
  http.get<CollectionDetail.Result>(`${APP}/blockchain/nft/collection/queryDetail`, params)
