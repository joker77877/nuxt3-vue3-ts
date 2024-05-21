// 作品模块
declare namespace Product {
  interface ReqDownloadList {
    productId: number
    downLoadType: number
    email?: string
    tradeOrderId?: number
  }

  interface ResDownloadList {
    productId: number
    name: string
    fileResourceUrlList: DownloadProductItem[]
  }

  interface DownloadProductItem {
    fileId: string // 文件id
    fileURL: string // 文件压缩包
    type: number // 1表是3D资产文件类型
    formatType: number // 文件类型
    gltfFileURL: string // 文件路径
    coverImageType: number // 封面图
    fileSize: number // 文件大小
  }
  interface AssertItem {
    id: number
    name: string
    introduction: string
    categoryId: number
    picUrl: string
    sliderPicUrls: Array<string>
    specType: boolean
    price: number
    marketPrice: number
    vipPrice: number
    stock: number
    salesCount: number
    favorite: boolean
    cart: boolean
  }
  // 3D资产首页请求参数
  interface ReqAssertListByFilters {
    pageNo: number
    pageSize: number
    ids?: Array<number>
    categoryIds?: number | null // 父类
    subCategoryIds?: number | null // 子类
    recommend?: boolean // 是否为编辑推荐
    keyword?: string
    sortFieldType?: number // 排序字段
    sortPriceFieldType?: number // 价格排序字段
    sortAsc?: boolean // 排序方式
    startPrice?: number | null // 起始价格
    endPrice?: number | null // 最大价格
    format?: number // 作品格式
    surfaceCount?: number // 面数
    chooseFree?: boolean // 是否免费
    choosePbr?: boolean // 是否是PBR
    chooseAnimation?: boolean // 是否有动画
    chooseTipPic?: boolean // 是否有贴图
    other?: Array<number> | null | undefined
    priceType?: number
  }
  // 3D资产首页返回参数
  interface ResAssertListByFilters {
    list: Array<ProductItem>
    total: number
  }

  interface ReqProductComment {
    content: string
    spuId: string
  }

  interface ReqSearchProduct {
    pageNo: number // 页码
    pageSize: number // 每页条数
    ids?: Array<number> // 作品SPU 编号数组 （搜索不需要）
    categoryIds?: number | null // 分类编号数组
    subCategoryIds?: number | null // 子类编号数组
    recommend?: boolean // 是否为编辑推荐
    keyword: string // 搜索关键字
    sortFieldType?: number // 排序字段,默认0；0:销量;1:最新上传;2:浏览量;3:收藏量;4:下载量;5:评论量;6:个人价格；7：企业价格；8：版权价格
    sortPriceFieldType?: number // 价格排序 6:个人价格；7：企业价格；8：版权价格
    priceType?: number // 价格的排序字段 0:个人价格；1：企业价格；2：版权价格（在界面上需要与sortFieldType分开渲染，在接口调用时需合入sortFieldType）
    sortAsc?: boolean // 排序方式,默认true；true:降序;false:升序
    startPrice?: number // 价格起始值,单位使用：分
    endPrice?: number // 价格终止值,单位使用：分
    format?: number // 选择格式，默认0；0:全部;1:glb;2:gltf
    surfaceCount?: number // 面数，默认0；0:全部;1:5K为止;2:10K为止;3:30K为止;4:100K为止;5:100K以上
    chooseFree?: boolean // 是否免费，默认false
    choosePbr?: boolean // 是否是PBR，默认false
    chooseAnimation?: boolean // 是否有动画，默认false
    chooseTippic?: boolean // 是否有贴图，默认false
    other?: Array<number> | null | undefined
  }

  interface ResSearchProduct {
    list: ProductItem[]
    total: number
  }

  interface RecommendItem {
    id: number
    name: string
    picUrl: string
    collectionCount: number
    commentCount: number
    browseCount: number
  }

  interface ReqUpdatePicUrl {
    fileResourceId: number
    multipartFile?: File
    type: 1 | 2 // 1表是3D资产文件类型，2、表示普通文件
    fHash: string
  }

  interface ReqUpdateModelConfig {
    fileResourceId: string
    editInfo: string
  }

  interface ProductItem {
    id: number
    productId: number
    name: string
    introduction: string
    categoryId: number
    picUrl: string
    sliderPicUrls: string[]
    specType: boolean
    price: number
    marketPrice: number
    vipPrice: number
    stock: number
    salesCount: number
    favorite: boolean
    cart: boolean
    personalPrice: string
    copyrightPrice: string
    enterprisesPrice: string
    publishType: 1 | 2 | 3
    collectionCount: number
    browseCount: string
    saleMode?: number[]
    creatorUrl: string
    creator: string
  }

  interface CommentItem {
    id: number
    userId: number
    userNickname: string
    userAvatar: string
    createTime: number
    time?: string
    spuId: number
    content: string
  }
  interface ResProductComment {
    total: number
    list: CommentItem[]
  }

  interface FileResourceUrlsRespDTO {
    fileId: string
    fileURL: string
    type: number
    formatType: number
    fileSize: number
    gltfFileURL: string
    coverImageType: any
  }

  interface ProductDetail {
    id: number // 作品 SPU 编号
    spuType: number // 1普通资产、2限量藏品
    price: number // 限量藏品价格
    stock: number // 限量藏品库存
    publisher: string // 发行方
    name: string // 作品名称
    introduction: string // 作品简介
    description: string // 作品详情
    categoryId: number // 作品分类编号
    categoryName: string // 作品分类
    picUrl: string // 作品封面图
    sliderPicUrls: string[] // 作品轮播图
    saleMode: number[] // 售卖方式，1、个人使用版权，2、企业使用版权 3、版权出售
    binarySaleMode: string // 售卖方式，1、个人使用版权，2、企业使用版权 3、版权出售
    personalPrice: number // 个人价格，单位使用：分
    enterprisesPrice: number // 企业价，单位使用：分
    copyrightPrice: number // 版权价格，单位使用：分
    browseCount: number // 浏览量
    collectionCount: number // 收藏量
    tagIds: number[] // 作品标签
    tags: string[] // 作品标签
    publishType: number // 发布类型1:作品出售2免费下载:3：只分享不支持下载
    favorite: boolean // 是否关注了该作品
    properties: Property[] // 作品属性值的明细
    craterUserId: number
    copyrightUserId: number
    visitorIsCreator: boolean
    visitorIsCopyright: boolean
    fileResourceInfoRespDTO: {
      fileResourceUrlsRespDTO: FileResourceUrlsRespDTO
      editInfo: string
    }
  }

  interface FormatDetail {
    keyName: string
    keyValue: string
  }

  interface ResProductResourceInfo {
    id: number
    productId: number
    creatorId: number
    copyrightUserId: number
    name: string
    fileResourceUrls: string
    type: string
    formatDetailList: FormatDetail[]
  }

  interface ReqProductBuyState {
    spuId: number
    saleMode: number
    spuType?: number
  }

  interface ResProductBuyState {
    state: number
    orderId?: number
    msg: string
    payId: number
  }

  interface ReqProductCommentPage extends ReqPage {
    spuId: string
  }
  interface ResProductCategory {
    id: number
    parentId?: number
    name: string
    picUrl?: string
  }

  // interface Category {
  //   id: number // 分类编号
  //   parentId: number // 父分类编号
  //   name: string // 分类名称
  //   picUrl: string // 分类图片
  // }

  interface Property {
    propertyId: number // 属性的编号
    propertyName: string // 属性的名称
    valueId: number // 属性值的编号
    valueName: string // 属性值的名称
  }
  // 添加作品的购物车REQUEST
  interface ReqAddProductToCart {
    count: number
    spuId: number
    rightType: number
  }

  interface ResCartProduct {
    validList: Array<CartProductInterface>
    invalidList: Array<CartProductInterface>
    totalPrice: string
  }
  interface CartProductInterface {
    id: number // 购物车id
    rightType: number // 授权类型
    status: number // 作品状态
    spu: SPUInterface
    count: number
  }
  interface SPUInterface {
    id: number
    name: string
    picUrl: string
    payPrice: number
    rightTypeList: number[]
  }
  // 创建订单,请求数据
  interface ReqCreateOrder {
    items: Array<CreateOrderProductItem>
  }
  interface CreateOrderProductItem {
    spuId?: number
    cartId?: number
    count: number
    rightType: number
    spuType?: number
  }
  // 创建订单,响应数据
  interface ResCreateOrder {
    id: number
    payOrderId: number
    existInvalidSpu: boolean
  }
  // 订单详情
  interface ResOrderDetail {
    id: number // 订单编号
    no: string // 订单流水
    type: number // 订单类型
    createTime: string
    status: number // 订单状态
    productCount: number // 购买的作品数量
    finishTime?: string // 订单完成时间
    cancelTime?: string // 订单取消时间
    payStatus: boolean // 是否已支付
    payOrderId: number // 支付订单编号
    payTime: string // 支付时间
    payExpireTime: string // 付款超时时间
    payChannelCode: string // 支付渠道
    payChannelName: string // 支付渠道名
    totalPrice: number // 作品原价
    discountPrice: number // 订单优惠
    payPrice: number // 应付金额
    items: Array<OrderProductInterface>
  }
  interface OrderProductInterface {
    id: number
    orderId: number // 订单编号
    spuId: number
    spuName: string
    picUrl: string
    count: number
    price: number
    payPrice: number
    rightType: number
    author: string
  }
  interface ReqSubmitOrder {
    id: number
    channelCode: string
    spuType: number
    returnUrl?: string
  }
  interface ResSubmitOrder {
    status: number
    displayMode: string
    displayContent: string
  }
  interface ResBalance {
    balance: number
    totalExpense: number
    totalRecharge: number
  }
  interface ReqUpdateCopyRight {
    cartId: number
    rightType: number
  }
  interface ResPayWay {
    payTypeCode: string
    code: string
    channelName: string
  }
  interface ResPayWay {
    payTypeCode: string
    code: string
    channelName: string
  }
  interface ResPayStatus {
    id: string
    status: number
  }
}
