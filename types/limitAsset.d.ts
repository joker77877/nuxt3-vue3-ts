declare namespace LimitAssetSelect {
  type Params = {
    position: number
  } & ReqPage
  type Result = Product.ProductItem[]
}

declare namespace LimitAssetRank {
  type Result = Product.ProductItem[]
  type Params = {
    type: number
    recentTime: number
  } & ReqPage
}

declare namespace LimitAssetList {
  type Result = {
    list: Product.ProductItem[]
    total: number
  }
  type Params = {
    type: number
    pageNo: number
    pageSize: number
    spuType: number
  }
}

declare namespace BlockChainAccount {
  type Result = {
    registerTime: string
    trainAddress: string
  }
  type Params = {
    trainAddress: string
  }
}

declare namespace BlockChainCollections {
  type Result = {
    list: {
      name: string
      hashCode: string
      createTime: string
    }[]
    total: number
  }
  type Params = {
    trainAddress: string
    pageNo?: number
    pageSize?: number
  }
}

declare namespace CollectionDetail {
  type Result = {
    collectionInfo: {
      name: string
      hashCode: string
      createUserName: string
      publisher: string
      spuId: string
    }
    transferInfo: {
      transferType: number
      fromTrainAddress: string
      toTrainAddress: string
      fromHashCode: string
      toHashCode: string
      createTime: string
    }
  }
  type Params = {
    hashCode: string
  }
}
