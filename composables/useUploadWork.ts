const useUploadWork = (isLimited = false) => {
  const fileList = toRef(uploadWorkStore, "fileList")
  const { runAsync: getFileStatus } = useRequest(getFileIsExist, { manual: true })

  /**
   * @description: 查看文件是否存在
   * @param {UploadRawFile} file
   * @return {*}
   */
  const isFileExist = async (file?: File) => {
    if (file) {
      const hash = await getFileHash(file)
      uploadWorkStore.fileHash = hash
      const { type, id, spuType, saleMode, spuStatus } = await getFileStatus({ fileResourceHash: hash })
      return { type, id, spuType, saleMode, spuStatus }
    }
    return { type: 1, id: 0, saleMode: [] }
  }

  /**
   * @description: 文件添加事件
   * @param {*}
   * @return {*}
   */
  const onFileChange: UploadProps["onChange"] = async ({ file, fileList: files }) => {
    if ((file.size || 0) > FILE_LIMIT_SIZE) {
      message.error("上传文件大小不能超过 100MB!")
    } else {
      const { type, id, spuType, saleMode, spuStatus } = await isFileExist(file as unknown as File)
      // 1、有商品 2、文件存在，但是不存在草稿/商品 3、未上传文件 4、其他人已上传该文件
      switch (type) {
        case ResourceExistStatusEnum.Inexistent:
          fileList.value = files
          break
        case ResourceExistStatusEnum.Exist:
          // 来源于限量资产上传
          if (isLimited) {
            // 之前发布的是限量藏品或者两者都发了，则去个人中心-限量藏品;
            if (spuType === AssetTypeEnum.LIMITED || spuType === AssetTypeEnum.BOTH) {
              Message.confirm({ title: "该限量资产已上架，请到个人中心查看" }).then(() => {
                navigateTo({ path: USER_CENTER_MENUS_MAP.limitAsset, query: { type: spuStatus } })
              })
              break
            }
            // 如果当前的售卖方式包括了版权出售，则不能发限量藏品，去个人中心-作品；
            if (saleMode.findIndex((item) => item === COPYRIGHT_TYPE_ENUM.COPYRIGHT_SALE) > -1) {
              Message.confirm({ title: "该资产已发布过版权出售，暂不支持发布限量藏品，请到个人中心查看" }).then(() => {
                navigateTo({ path: USER_CENTER_MENUS_MAP.product, query: { type: spuStatus } })
              })
            } else {
              navigateTo({ path: `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`, query: { fileResourceId: id } })
            }
            break
          }
          // 来源于普通3D资产
          // 之前发布的是普通3D或者两者都发了，则去个人中心-作品
          if (spuType === AssetTypeEnum.NORMAL || spuType === AssetTypeEnum.BOTH) {
            Message.confirm({ title: "该作品已上架，请到个人中心查看" }).then(() => {
              navigateTo({ path: USER_CENTER_MENUS_MAP.product, query: { type: spuStatus } })
            })
            break
          } else {
            // 之前发布的是限量藏品，则还可以发布使用权
            navigateTo({ path: "/works", query: { fileResourceId: id } })
          }
          break
        case ResourceExistStatusEnum.Uploading:
          if (isLimited) {
            navigateTo({ path: `${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`, query: { fileResourceId: id } })
          } else {
            navigateTo({ path: "/works", query: { fileResourceId: id } })
          }

          nextTick(() => {
            clearUploadWorkStore()
          })
          break
        case ResourceExistStatusEnum.Same:
          Message.confirm({ title: "该商品已被别人上传" })
          break
        default:
          break
      }
    }
  }
  return {
    isFileExist,
    onFileChange,
    getFileStatus,
    fileList
  }
}
export { useUploadWork }
