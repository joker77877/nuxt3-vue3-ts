/**
 * @name 文件上传模块
 */

import { AxiosRequestConfig } from "axios"

// 图片上传
export const uploadImg = (params: UploadOneFile.Params) => {
  return http.upload<UploadOneFile.Result>(`${APP}/infra/file/save/file`, params, { timeout: 30000 })
}

// 视频上传
export const uploadVideo = (params: UploadOneFile.Params) => {
  return http.upload<UploadOneFile.Result>(`${APP}/infra/file/save/file`, params, { timeout: 30000 })
}
/**
 * @description: 获取作品资源是否存在
 * @param {GetFileIsExist} params
 * @return {*}
 */
export const getFileIsExist = (params: GetFileIsExist.Params) => {
  return http.get<GetFileIsExist.Result>(`${APP}/infra/file/resource/is/exist`, params)
}
// 上传作品文件
export const uploadFile = (params: UploadOneFile.Params, config?: AxiosRequestConfig) => {
  // return http.upload<UploadOneFile.Result>(`${APP}/infra/file/save/file`, params, { ...config })
  const authStore = useAuthStore()
  const token = authStore.accessToken
  return axios.postForm<UploadOneFile.Result>(`${APP}/infra/file/save/file`, params, {
    ...config,
    headers: {
      "tenant-id": "1",
      Authorization: `Bearer ${token}`
    },
    transformResponse: [
      (data) => {
        const res = JSON.parse(data)
        return res.data
      }
    ]
  })
}

// 断点续传
export const uploadChunkFile = (params: UploadChunkFile.Params) => {
  return http.upload<UploadChunkFile.Result>(`${APP}/infra/file/save/chunk/file`, params, { timeout: 30000 })
}
export const publishProduct = (params: PublishProduct.Params) => {
  return http.put<PublishProduct.Result>(`${APP}/product/update/publish`, params)
}
export const saveDraft = (params: SaveDraft.Params) => {
  return http.post<SaveDraft.Result>(`${APP}/product/save/draft`, params)
}
/**
 * @description: 保存资产缩略图
 * @param {UpdateFile3D} params
 * @return {*}
 */
export const updateFile3D = (params: UpdateFile3D.Params) => {
  return http.upload<UpdateFile3D.Result>(`${APP}/infra/file/update/file3D`, params, { timeout: 10000 })
}
/* 查询作品类别列表 */
export const getProductCategoryList = () => {
  return http.get<GetProductCategoryList.Result>(`${APP}/product/category/list`)
}

/* 查询作品详情 */
export const getWorksDetail = (params: GetWorksDetail.Params) => {
  return http.get<GetWorksDetail.Result>(`${APP}/product/get-edit-detail`, params)
}
/**
 * @description: 获取文件地址
 * @param {GetResourceInfo} params
 * @return {*}
 */
export const getResourceInfo = (params: GetResourceInfo.Params) => {
  return http.get<GetResourceInfo.Result>(`${APP}/infra/file/resource/info`, params)
}
