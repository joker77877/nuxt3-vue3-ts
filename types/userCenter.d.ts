/* 3D资产状态: 0 下架（禁用） 1、草稿状态 2、3D资产待审核 3、 上架（开启） */
type UserWorksStatus = -1 | 0 | 1 | 2 | 3 | 4 | 5
/* 售卖类型，1个人授权，2企业授权，3版权售出 */
type RightType = 1 | 2 | 3
/**
 * 售卖类型，0待支付，10待发货， 20已发货，30已完成，40已取消
 */
type OrderType = 0 | 10 | 20 | 30 | 40

declare namespace GetSpuList {
  interface Params {
    pageNo: number
    pageSize: number
    status: number
    name: string
    userId?: number
    spuType: number // 1普通资产2限量资产
  }
  interface Item {
    id: number
    name: string
    categoryId: number
    categoryName: string
    picUrl: string
    status: UserWorksStatus
    saleMode: number[]
    personalPrice: number
    enterprisesPrice: number
    copyrightPrice: number
    publishType: number
    browseCount: number
    collectionCount: number
    commentCount: number
    createTime: number
    updateTime: number
    subCommissionType: boolean
    deleted: boolean
    deliveryTemplateId: number
    giveIntegral: number
    copyrightUserId: number
    craterUserId: number
    author: string
    publisher: string
    fileResourceId: string
    publisher: string
    fileResourceId: string
  }

  interface Result {
    list: Item[]
    total: number
  }
}
declare namespace GetOrderList {
  interface Params {
    pageNo: number
    pageSize: number
    status?: number
  }

  interface List {
    id: number
    no: string
    type: number
    /**
     * 售卖类型，0待支付，10待发货， 20已发货，30已完成，40已取消
     */
    status: OrderType
    productCount: number
    commentStatus: boolean
    createTime: number
    payOrderId: number
    payPrice: number
    deliveryType: number
    items: Item[]
  }

  interface Item {
    id: number
    orderId: number
    spuId: number
    spuName: string
    skuId: number
    ownerProduct: boolean
    properties: number[]
    picUrl: string
    count: number
    commentStatus: boolean
    price: number
    payPrice: string
    originalPrice: string
    afterSaleId: number
    afterSaleStatus: number
    rightType: RightType
    author: string
    spuType: number
  }

  interface Result {
    list: List[]
    total: number
  }
}

declare namespace GetWorksOrderDetail {
  interface Params {
    id: string
  }
  interface Item {
    id: number
    orderId: number
    spuId: number
    spuName: string
    skuId: number
    properties: number[]
    picUrl: string
    count: number
    commentStatus: boolean
    price: number
    payPrice: string
    originalPrice: string
    afterSaleId: number
    afterSaleStatus: number
    rightType: number
    author: string
  }

  interface Result {
    id: number
    no: string
    type: number
    createTime: number
    userRemark: string
    status: number
    productCount: number
    finishTime: string
    cancelTime: string
    commentStatus: boolean
    payStatus: boolean
    payOrderId: number
    payTime: string
    payExpireTime: number
    payChannelCode: string
    payChannelName: string
    totalPrice: string
    discountPrice: number
    deliveryPrice: number
    adjustPrice: number
    payPrice: string
    deliveryType: number
    logisticsId: number
    logisticsName: string
    logisticsNo: string
    deliveryTime: string
    receiveTime: string
    receiverName: string
    receiverMobile: string
    receiverAreaId: number
    receiverAreaName: string
    receiverDetailAddress: string
    pickUpStoreId: number
    pickUpVerifyCode: string
    refundStatus: number
    refundPrice: number
    couponId: number
    couponPrice: number
    pointPrice: number
    vipPrice: number
    items: Item[]
  }
}

declare namespace UpdateProductStatus {
  interface Params {
    id: number
    status: UserWorksStatus
  }
  type Result = true
}

interface RootObject {
  list: List[]
  total: number
}

// 上传记录
declare namespace UpLoadRecord {
  interface Params {
    pageNo: number
    pageSize: number
  }
  interface Item {
    id: string
    productId: number
    name: string
    spuName: string
    createTime: string
    fileResourceHash: string
  }

  interface Result {
    list: Item[]
    total: number
  }
}
