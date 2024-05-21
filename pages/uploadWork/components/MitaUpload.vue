<template>
  <div class="upload-file h-[556px] w-[544px] rounded-[10px] bg-white px-11 py-10 flex-col-center">
    <div class="relative w-full flex-1 rounded-[10px] bg-[#F5F5F5]">
      <a-spin class="absolute h-full w-full flex-col-center" :spinning="uploadLoading">
        <template #tip>
          <span class="break-all px-5 text-2xl text-regular" style="position: static">
            {{ fileList?.[0]?.name }}
          </span>
        </template>
        <template #indicator>
          <IconLoading class="anticon-spin"></IconLoading>
        </template>
        <div class="h-[404px] w-[456px]">
          <RenderCanvas
            v-if="canvasFileUrl"
            :file-url="canvasFileUrl"
            :pic-url="picUrl"
            :type="RenderCanvasTypeEnum.Upload"
            :get-thumbnail="getThumbnail"
            :model-configuration="props.modelConfiguration"
            canvas-id="upload-edit"
            :save-default-config="saveModelDefaultConfig"></RenderCanvas>
        </div>
      </a-spin>
      <div class="progress absolute bottom-3 z-[3000] h-6 w-full" v-if="uploadLoading">
        <a-progress
          class="flex h-6 items-center"
          trail-color="rgba(0,0,0,0)"
          stroke-linecap="square"
          :stroke-color="{
            '0%': 'rgba(98, 163, 241, 1)',
            '100%': 'rgba(59, 130, 237, 1)'
          }"
          :percent="filePercent"
          :size="12"
          striped>
          <template #format="percent">
            <div class="absolute top-[-22px] flex flex-col-items-center" :style="{ left: `calc(${percent}% - 22px)` }">
              <span class="text-xs italic text-blue">{{ percent }}%</span>
              <icon-progress-arrow class="text-blue"></icon-progress-arrow>
            </div>
          </template>
        </a-progress>
      </div>
    </div>
    <div class="w-full pt-6 flex-center">
      <a-button
        type="primary"
        :disabled="uploadLoading"
        size="large"
        class="w-[264px] text-base flex-center"
        @click="goModelEditor">
        <icon-edit></icon-edit>
        <span class="ml-3">编辑3D设置</span>
      </a-button>
      <a-upload
        :file-list="fileList"
        :show-upload-list="false"
        class="ml-3 flex-1"
        :max-count="1"
        accept=".zip,.rar,.7z,.glb,.gitf"
        @change="onFileChange"
        :before-upload="() => false">
        <a-button type="primary" :disabled="uploadLoading" ghost size="large" class="w-full text-base flex-center">
          <template #icon><icon-add-file></icon-add-file></template>

          <span class="ml-3">重新上传</span>
        </a-button>
      </a-upload>
    </div>
  </div>
</template>
<script setup lang="ts">
const { runAsync: upload, loading: uploadFileLoading } = useRequest(uploadFile, { manual: true })
const { run: updateThumb } = useRequest(updateFile3D, { manual: true })
const { onFileChange, fileList } = useUploadWork()
interface Props {
  isLimited: Boolean
  modelConfiguration?: Object
}
const emit = defineEmits(["goModelEditor", "completeUpload", "startUpload"])
// 是否限量资产
const props = defineProps<Props>()

const uploadPercent = ref(0)
const uploadChunksPercent = ref(0)
const uploadChunkLoading = ref(false)

/* computed */
const filePercent = computed(() => uploadPercent.value || uploadChunksPercent.value)
const uploadLoading = computed(() => uploadFileLoading.value || uploadChunkLoading.value)
const fileItem = computed(() => fileList.value?.[0])
const { fileHash } = toRefs(uploadWorkStore)
const fileResourceId = defineModel<string>("fileResourceId", { required: true })
const canvasFileUrl = defineModel<string>("canvasFileUrl")
const picUrl = defineModel<string>("picUrl")

/**
 * 进入3D编辑页面
 */
const goModelEditor = () => {
  console.log("跳转3D编辑器")
  emit("goModelEditor")
  // navigateTo(`/asset-editor/${fileResourceId.value}`)
}

/**
 * @description: 获取作品信息以及上传封面图
 * @param {string} val
 * @param {string} info
 * @return {*}
 */
const getThumbnail = (val: string, info: string) => {
  let reg = /data:image\/(?<ext>.*?);base64,.*/
  let res = reg.exec(val)
  const ext = res?.groups?.ext || "png"
  const [name] = fileItem.value?.name.split(".") || []
  const fileName = `${name}.${ext}`
  const file = base64UrlToFile(val, fileName)
  updateThumb({
    multipartFile: file,
    fHash: fileHash.value,
    formatDetails: info,
    type: 3,
    isBlock: 0,
    coverImageType: 1,
    fileResourceId: fileResourceId.value
  })
}

const saveModelDefaultConfig = async (config: Object) => {
  await updateSpuModelConfig({
    fileResourceId: fileResourceId.value as string,
    editInfo: JSON.stringify(config)
  })
}

/**
 * @description: 上传文件
 * @return {*}
 */

const uploadOrUploadChunks = async () => {
  const file = fileList.value[0]
  if (file) {
    // if ((file.size ?? 0) < FILE_CHUNK_LIMIT_SIZE) {
    try {
      // 开始上传
      emit("startUpload", true)
      const { data: res } = await upload(
        {
          multipartFile: file.originFileObj as File,
          type: UploadFileResTypeEnum.Resource,
          fHash: fileHash.value,
          spuType: props.isLimited ? AssetTypeEnum.LIMITED : AssetTypeEnum.NORMAL
        },
        {
          onUploadProgress(e) {
            uploadPercent.value = Math.round((e.progress || 0) * 100)
          },
          timeout: 300000
        }
      )
      uploadPercent.value = 0
      fileResourceId.value = res.fileResourceId
      const [canvas, pic] = res.fileResourceUrlsRespList
      canvasFileUrl.value = canvas.gltfFileURL || canvas.fileURL
      picUrl.value = pic?.fileURL
    } catch (error) {
      message.error("上传失败")
    }

    // } else {
    //   uploadChunkLoading.value = true
    //   let chunksList = fileChunks.value.map((chunk, i) => ({
    //     chunk: i,
    //     type: 1,
    //     fHash: fileHash.value,
    //     chunks: fileChunks.value.length,
    //     chunkSize: chunk.size,
    //     multipartFile: chunk
    //   }))
    //   let fileId: number
    //   const requestList = chunksList.map(
    //     (e, i) => () =>
    //       uploadChunk({ ...e, fileId }).then((res) => {
    //         if (!i) {
    //           fileId = ruserInfoes.fileId
    //         }
    //         const percent = Math.round((100 / chunksList.length) * (i + 1))
    //         uploadChunksPercent.value = percent > 100 ? 100 : percent
    //       })
    //   )
    //   let i = 0
    //   let send = async () => {
    //     // 都发完了
    //     // if (this.abort) return
    //     if (i >= requestList.length) {
    //       uploadChunkLoading.value = false
    //       uploadChunksPercent.value = 0
    //       return false
    //     }
    //     await requestList[i]()
    //     i += 1
    //     send()
    //     return false
    //   }
    //   send()
    // }
  }
}

watch(
  () => fileList.value,
  (val) => {
    if (val) {
      uploadOrUploadChunks()
    }
  },
  { deep: true, immediate: true }
)
watch(
  () => uploadLoading.value,
  (value) => {
    if (!value) {
      // 完成上传
      emit("completeUpload", value)
    }
  },
  { deep: true }
)
</script>
<style lang="postcss" scoped>
.upload-file {
  :deep(.ant-upload) {
    @apply h-full w-full;
  }
  :deep(.ant-progress-inner) {
    display: block;
    border-radius: 0;
  }
  :deep(.ant-progress-outer) {
    padding-inline-end: 0;
    border-radius: 0;
  }
  :deep(.a-upload) {
    width: 100%;
  }
  :deep(.ant-spin) {
    display: flex;
    .ant-spin-text {
      position: static;
      padding: 0;
      margin-top: 36px;
    }
    .anticon-spin {
      position: static;
      font-size: 100px;
    }
  }
  .progress {
    background: linear-gradient(0deg, #dadee7 0%, #b2c1e9 100%);
  }
}
</style>
