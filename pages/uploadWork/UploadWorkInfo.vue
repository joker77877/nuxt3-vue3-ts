<template>
  <client-only>
    <a-config-provider
      :theme="{
        components: {
          Input: {
            // controlHeight: 58,
            paddingSM: 20
          },
          Select: {
            // controlHeight: 58,
            paddingSM: 20
          },
          Form: {
            fontSize: 16
          },
          // Radio: {
          //   fontSize: 14
          // },
          Tag: {
            fontSize: 16
          }
        }
      }">
      <div class="upload-info min-h-screen bg-[#F5F5F5]">
        <SimpleHeader></SimpleHeader>
        <div class="flex gap-7 px-12 pt-8">
          <MitaUpload
            v-model:fileResourceId="fileResourceId"
            v-model:canvasFileUrl="canvasFileUrl"
            v-model:picUrl="picUrl"
            :is-limited="isLimited"
            :model-configuration="modelConfiguration"
            @go-model-editor="goModelEditorHandle"
            @complete-upload="handlerCompleteUpload"
            @start-upload="handlerStartUpload"></MitaUpload>
          <LimitedAssetForm v-if="isLimited" ref="formRef"></LimitedAssetForm>
          <UploadWorkForm v-else ref="formRef"></UploadWorkForm>
        </div>
        <div class="upload-btn fixed bottom-0 h-[84px] w-full bg-[#F5F5F5] pt-3 flex-justify-center">
          <a-button
            v-if="isLimited"
            :disabled="uploading"
            type="default"
            size="large"
            class="mr-3 w-[120px] text-base"
            @click="onPreview">
            预览
          </a-button>
          <a-button
            type="default"
            size="large"
            class="w-[120px] text-base"
            :disabled="uploading"
            :loading="saveDraftLoading"
            @click="onSaveDraft">
            保存草稿
          </a-button>
          <a-button
            type="primary"
            size="large"
            class="ml-3 w-[120px] text-base"
            :loading="publisLoading"
            :disabled="disabled"
            @click="onPublish">
            {{ isLimited ? "铸造" : "发布" }}
          </a-button>
        </div>
      </div>
    </a-config-provider>
    <PreViewDialog ref="preViewDialogRef"></PreViewDialog>
  </client-only>
</template>
<script setup lang="tsx">
import UploadWorkForm from "./components/UploadWorkForm.vue"
import LimitedAssetForm from "./components/LimitedAssetForm.vue"

// 是否限量资产
const { isLimited } = defineProps({
  isLimited: Boolean
})

const router = useRouter()
const route = useRoute()
const formRef = ref<InstanceType<typeof UploadWorkForm> | InstanceType<typeof LimitedAssetForm>>()
const modelConfiguration = ref<Object>({})
const { fileList } = useUploadWork(isLimited)
const { loading: publisLoading, runAsync: publish } = useRequest(publishProduct, { manual: true })
// 文件上传
const uploading = ref(false)

const { runAsync: getInfo } = useRequest(getResourceInfo, {
  manual: true,
  onError() {
    navigateTo("/404")
  }
})
const { runAsync: getDetail } = useRequest(getWorksDetail, {
  manual: true,
  onError() {
    navigateTo("/404")
  }
})
const { loading: saveDraftLoading, runAsync: save } = useRequest(saveDraft, { manual: true })

// const { runAsync: uploadChunk } = useRequest(uploadChunkFile, { manual: true })
/* ref reactive */

const id = ref("")
const canvasFileUrl = ref("")
const picUrl = ref("")
const fileResourceId = ref<string>("")
const isPublishForLimited = ref(false)

/* computed */

const disabled = computed(() =>
  Boolean(
    Object.keys(formRef.value?.validateInfos || {}).some((k) => formRef.value?.validateInfos[k].validateStatus !== "success") ||
      !canvasFileUrl.value
  )
)
const publishAction = async () => {
  const res: any = await publish({
    ...formRef.value?.form,
    fileResourceId: fileResourceId.value,
    status: AssetStatusEnum.NORMAL,
    introduction: "",
    id: id.value,
    spuType: isLimited ? AssetTypeEnum.LIMITED : AssetTypeEnum.NORMAL
  } as any)

  const needAuth =
    res.data?.status &&
    [UserCertificationStatus.UN_AUTH, UserCertificationStatus.NO_PASS, UserCertificationStatus.EXPIRED].includes(res.data.status)
  if (needAuth) {
    const type = useAuthStore().userInfo?.userType
    if (type === UserType.PERSONAL) {
      console.log("要跳转个人认证")
      navigateTo("/user/auth-personal")
    } else if (type === UserType.COMPANY) {
      console.log("要跳转企业认证")
      navigateTo("/user/auth-company")
    }
  }

  return needAuth
}

/**
 * @description: 发布作品
 * @return {*}
 */
const onPublish = async () => {
  const isValid = await formRef.value?.validate()
  if (isValid && fileResourceId.value && formRef.value) {
    if (isLimited) {
      Message.confirm({ message: "确认铸造后永久上链，不可篡改" }).then(async () => {
        const needAuth = await publishAction()
        if (!needAuth) {
          message.success("发布限量藏品成功，请耐心等待审核结果")
        }
      })
    } else {
      const needAuth = await publishAction()
      if (!needAuth) {
        message.success("发布作品成功，请耐心等待审核结果")
        navigateTo({ path: USER_CENTER_MENUS_MAP.product, query: { type: ProductListStateEnum.CHECKING } })
      }
    }
    clearUploadWorkStore()
  }
}

/**
 * @description: 保存草稿
 * @return {*}
 */
const onSaveDraft = async () => {
  const productId = await save({
    ...formRef.value?.form,
    fileResourceId: fileResourceId.value,
    status: AssetStatusEnum.DRAFT,
    introduction: "",
    id: id.value,
    spuType: isLimited ? AssetTypeEnum.LIMITED : AssetTypeEnum.NORMAL
  } as any)
  id.value = productId
  message.success("保存草稿成功！")
}

// 跳转3D设置
const goModelEditorHandle = async () => {
  await onSaveDraft()
  navigateTo({
    path: `/asset-editor/${fileResourceId.value}`,
    query: {
      isLimited: isLimited ? "true" : "false",
      proId: id.value
    }
  })
}
/**
 * @description: 预览
 * @return {*}
 */
const preViewDialogRef = ref()
const onPreview = () => {
  const detail = {
    ...formRef.value?.form,
    fileResourceId,
    canvasFileUrl,
    picUrl,
    browseCount: 0, // 浏览量
    collectionCount: 0, // 收藏量
    fileResourceInfoRespDTO: {
      fileResourceUrlsRespDTO: {
        fileResourceId,
        canvasFileUrl,
        picUrl
      },
      editInfo: "string"
    }
  }
  preViewDialogRef.value.openDialog(detail)
}

const getDetailAction = async (pid: string, from = "edit") => {
  const data = await getDetail({ id: pid, from })
  id.value = pid
  if (data.status === ProductListStateEnum.ENABLE) {
    Message.confirm({ showCancel: false, message: "该作品已发布不能编辑，请到作品详情页查看" })
      .then(() => {
        navigateTo(`/asset/${pid}`)
      })
      .catch(() => {
        router.back()
      })
    return
  }
  formRef.value?.setFormValue(data)
  fileResourceId.value = data.fileResourceId
  // 获取模型配置信息
  if (data.fileResourceId) {
    const modelInfo = await getInfo({
      fileResourceId: fileResourceId.value
    })
    console.log("获取作品中模型设置信息", modelInfo)
    if (modelInfo.editInfo) {
      modelConfiguration.value = JSON.parse(modelInfo.editInfo)
    }
  }
  // 获取模型缩略图
  canvasFileUrl.value = data.fileResourceUrlsResp.gltfFileURL || data.fileResourceUrlsResp.fileURL
  picUrl.value = data.picUrl
}
// 文件开始上传时的钩子函数
const handlerStartUpload = () => {
  console.log("开始上传*******")
  uploading.value = true
}
// 文件上传完成后的回调
const handlerCompleteUpload = () => {
  uploading.value = false
  console.log("结束上传*******")
}

watch(
  [() => route.params.id, () => route.query.fileResourceId],
  async ([val, valNd]) => {
    const productId = val
    const resourceId = valNd as string
    if (route.path.includes("/works") || route.path.includes(`${INDEX_ROUTE.LIMIT_ASSET}${INDEX_ROUTE.EDIT}`)) {
      if (resourceId) {
        const data = await getInfo({ fileResourceId: resourceId })
        const { saleMode, spuType, productId: pid } = data
        // 当前是限量资产添加且该资源已经被发过普通资产且发布中不包括版权出售，则可以回填该资产的基本信息
        const flag = saleMode?.findIndex((item) => item === COPYRIGHT_TYPE_ENUM.COPYRIGHT_SALE) > -1
        if (isLimited && spuType === AssetTypeEnum.NORMAL && !flag) {
          getDetailAction(pid, "add")
        }
        // 当前是普通3D资产发布且该资源已经被限量资产发售过，则要回填基本信息，并且版权出售的价格置灰
        if (!isLimited && spuType === AssetTypeEnum.LIMITED) {
          getDetailAction(pid, "add")
          isPublishForLimited.value = true
        }
        if (pid) {
          getDetailAction(pid, "add")
        }
        fileResourceId.value = resourceId
        const [canvas, pic] = data.fileResourceUrlsList
        if (data.editInfo) {
          modelConfiguration.value = JSON.parse(data.editInfo)
        }
        canvasFileUrl.value = canvas.gltfFileURL || canvas.fileURL
        picUrl.value = pic?.fileURL
      } else if (productId) {
        // id.value = productId as string
        getDetailAction(Array.isArray(productId) ? productId[0] : (productId as string))
      } else if (!fileList.value.length) {
        navigateTo("/404")
      }
    }

    return false
  },
  { immediate: true }
)

onUnmounted(() => {
  clearUploadWorkStore()
})
</script>
<style scoped lang="postcss">
.upload-btn {
  box-shadow: 0 -4px 45px 0 rgb(35 40 51 / 10%);
}
</style>
