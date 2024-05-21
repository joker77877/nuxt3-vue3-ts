interface UploadWorkInfoForm {
  name: string
  // introduction: string
  description: string
  categoryId?: number
  personalPrice?: number
  enterprisesPrice?: number
  copyrightPrice?: number
  tags: string[]
  publishType?: number
}
interface LimitedAssetForm {
  name: string // 名称
  price?: number // 价格
  publisher: string // 发行方
  categoryId?: number // 分类
  description: string // 描述
  stock?: number // 数量
}
/* 1 表示已经上传了作品，跳转到作品列表2、已经上传了文件，跳转到上传记录,3表示3D资源不存在，4表示3D资源已经存在，不要重复上传 */
type ResourceExistStatus = 1 | 2 | 3 | 4
