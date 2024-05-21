<template>
  <div>
    <p class="text-lg">企业信息</p>

    <a-alert
      class="mt-2 text-[#409EFF]"
      banner
      message="预计在 1~2 个工作日内完成审核。通过审核后，在商业对接列表可以搜索到您的企业"
      type="info"
      show-icon
      v-if="detail?.status === MarkerStatusEnum.Apply"></a-alert>
    <a-alert
      class="mt-2 text-[#F56C6C]"
      banner
      message="审核不通过，请修改后重新提交。"
      type="error"
      show-icon
      v-else-if="detail?.status === MarkerStatusEnum.Refuse"></a-alert>
    <a-form
      class="mt-5"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :colon="false"
      :disabled="detail?.status === MarkerStatusEnum.Apply">
      <a-form-item class="item-upload" label="企业logo" v-bind="validateInfos.makerPicUrl">
        <a-upload
          :show-upload-list="false"
          v-model:fileList="fileList"
          :max-count="1"
          class="avatar-uploader"
          :before-upload="beforeUpload"
          accept=".png,.jpg,.gif">
          <div class="h-[140px] w-[224px] mita-border-dashed">
            <Image v-if="model.makerPicUrl && !loading" :pic-url="model.makerPicUrl" class="h-full w-full"></Image>
            <div v-else class="h-full text-[#cccccc] flex-col-center">
              <IconLoading class="anticon-spin w-10 h-10" v-if="loading"></IconLoading>
              <template v-else>
                <PlusOutlined class="text-xl"></PlusOutlined>
                <div class="mt-2">上传图片</div>
              </template>
            </div>
          </div>
        </a-upload>
        <span class="mita-text-grey-nd ml-2">支持png/gif/jpg图片格式，图片大小不超过10MB</span>
      </a-form-item>
      <a-form-item label="企业名称" v-bind="validateInfos.makerName">
        <a-input v-model:value="model.makerName" placeholder="请输入企业名称"></a-input>
      </a-form-item>
      <a-form-item label="企业网站" v-bind="validateInfos.makerWebsite">
        <a-input v-model:value="model.makerWebsite" placeholder="请输入企业网站，比如：https://www.baidu.com/"></a-input>
      </a-form-item>
      <a-form-item label="企业简介" v-bind="validateInfos.makerIntroduction">
        <ClientOnly fallback="加载评论中...">
          <Editor v-model:value="model.makerIntroduction" :disabled="detail?.status === MarkerStatusEnum.Apply"></Editor>
        </ClientOnly>
        <!-- <a-input v-model:value="model.makerIntroduction" placeholder="请输入企业网站，比如：https://www.baidu.com/"></a-input> -->
      </a-form-item>
      <a-form-item label="提供服务" v-bind="validateInfos.serviceTagIdList">
        <a-select
          allow-clear
          v-model:value="model.serviceTagIdList"
          placeholder="请选择服务"
          mode="multiple"
          :options="tags.filter((e) => e.tagType === UserTagsType.Service).map((e) => ({ label: e.name, value: e.id }))">
          <template #tagRender="{ label, closable, onClose }">
            <a-tag color="#115EE8" :closable="closable" class="" @close="onClose">
              {{ label }}
            </a-tag>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="行业领域" v-bind="validateInfos.sectorTagId">
        <a-select
          v-model:value="model.sectorTagId"
          allow-clear
          :options="tags.filter((e) => e.tagType === UserTagsType.Industry).map((e) => ({ label: e.name, value: e.id }))"
          placeholder="请选择标签"></a-select>
      </a-form-item>
      <!-- <a-form-item label="标签" v-bind="validateInfos.makerSelfLabel">
        <a-select allow-clear :open="false" v-model:value="model.makerSelfLabel" placeholder="请选择标签" mode="tags">
          <template #tagRender="{ label, closable, onClose }">
            <a-tag color="#115EE8" :closable="closable" class="" @close="onClose">
              {{ label }}
            </a-tag>
          </template>
        </a-select>
      </a-form-item> -->
      <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
        <a-button
          type="primary"
          :disabled="(detail?.status && !detail?.updateFlag) || submitDisabled"
          :loading="createLoading || updateLoading"
          @click.prevent="onSubmit"
          class="w-[164px]">
          {{ detail?.status === MarkerStatusEnum.Apply ? "审核中" : "提交" }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ detail: MakerInfo | null; refresh: () => void }>()
const { detail } = toRefs(props)
const { data: tags } = await useAsyncData(() => getUserTagList(), {
  server: false,
  default: () => []
})
const { useForm } = Form

const labelCol = { span: 2 }
const wrapperCol = { span: 14 }
const model = reactive<MakerForm>({
  makerName: "",
  makerWebsite: "",
  makerIntroduction: "",
  makerPicUrl: "",
  status: 0,
  serviceTagIdList: [],
  makerSelfLabel: [],
  sectorTagId: undefined
})
const fileList = ref<UploadFile[]>([])

const rulesRef = reactive({
  makerName: [
    {
      required: true,
      message: "请输入企业名称"
    },
    NOT_ONLY_WHITESPACE
  ],
  makerPicUrl: [
    {
      required: true,
      message: "请上传企业logo"
    }
  ],
  makerIntroduction: [
    {
      required: true,
      message: "请输入企业简介"
    }
  ]
})
const { loading, runAsync: upload } = useRequest(uploadFile, { manual: true })
const { loading: createLoading, runAsync: create } = useRequest(createMaker, {
  manual: true,
  onSuccess() {
    message.success("创建企业成功！")
  }
})
const { loading: updateLoading, runAsync: update } = useRequest(updateMaker, {
  manual: true,
  onSuccess() {
    message.success("更新企业信息成功！")
  }
})

const { validate, validateInfos } = useForm(model, rulesRef)
const submitDisabled = computed(() => Object.keys(validateInfos).some((k) => validateInfos[k].validateStatus !== "success"))
const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
  if (file.size > IMG_CHUNK_LIMIT_SIZE) {
    return false
  }
  fileList.value = [...(fileList.value || []), file]
  const hash = await getFileHash(file)
  const { data } = await upload({
    multipartFile: file,
    type: UploadFileResTypeEnum.General,
    fHash: hash
  })
  const { fileResourceUrlsRespList } = data
  model.makerPicUrl = fileResourceUrlsRespList[0].fileURL
  return false
}
/**
 * @description: 提交
 * @return {*}
 */
const onSubmit = () => {
  validate().then(() => {
    const params = toRaw(model)
    Message.confirm({ title: "确认提交后，一个月内无法编辑修改" }).then(async () => {
      if (detail.value?.status === MarkerStatusEnum.Not) {
        await create(params)
      } else if (detail.value?.updateFlag) {
        await update({ ...params, id: detail.value?.id })
      }
      window.location.reload()
    })
  })
}
watch(
  () => detail.value,
  async (val) => {
    if (val && val.status) {
      Object.keys(model).forEach((k) => {
        const key = k as keyof MakerForm
        if (val?.[key]) {
          model[key] = val?.[key] as never
        }
      })
      await validate()
    }
  },
  {
    immediate: true
  }
)
</script>
<style lang="postcss" scoped>
.item-upload {
  :deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: end;
  }
  :deep(.ant-upload-select) {
    display: block;
  }
}

/* .avatar-uploader {
  :deep(.ant-upload) {
    @apply h-[140px] w-[224px];
  }
} */
</style>
