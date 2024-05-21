/* 1表是3D资产文件类型，2、表示普通文件 */
export enum UploadFileResTypeEnum {
  Resource = 1,
  General,
  COVER
}

/* 1代表需要传输缩略图，2、表示不传 */
export enum RenderCanvasTypeEnum {
  Upload = 1,
  Default
}
/* 发布类型1:作品出售2免费下载:3：只分享不支持下载 */
export enum PublishTypeEnum {
  Sell = 1,
  Download,
  Share
}
/* 发布类型1:作品出售2免费下载:3：只分享不支持下载 */
export enum UploadStepEnum {
  One = 1,
  Two
}
/* 查询上传文件的状态 */
/* 1 表示已经上传了作品，跳转到作品列表2、已经上传了文件，跳转到上传记录,3表示3D资源不存在，4表示3D资源已经存在，不要重复上传 */
export enum ResourceExistStatusEnum {
  Exist = 1,
  Uploading,
  Inexistent,
  Same
}
