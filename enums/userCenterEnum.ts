export enum ProductListStateEnum {
  RECYCLE = -1,
  /**
   *  @description: 下架（禁用
   */
  DISABLE,
  /**
   * @description: 草稿状态
   */
  DRAFT,
  /**
   *  @description: 3D资产待审核
   */
  CHECKING,
  /**
   *  @description: 上架（开启）
   */
  ENABLE,
  /**
   * @description: 版权售出中
   */
  COPYRIGHT_ON_SALE,
  /**
   * @description: 版权已售出
   * @return {*}
   */
  COPYRIGHT_SALE_OUT
}

/**
 * 售卖类型，1个人授权，2企业授权，3版权售出
 */
export enum RightTypeEnum {
  Personal = 1,
  Enterprise,
  Copyright
}
/**
 * 售卖类型，0待支付，10待发货， 20已发货，30已完成，40已取消
 */
export enum OrderTypeEnum {
  UnPaid,
  UnDelivered = 10,
  Delivered = 20,
  Completed = 30,
  Canceled = 40
}
