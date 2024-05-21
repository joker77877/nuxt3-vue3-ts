<template>
  <div>
    <a-form class="mt-5" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="detail?.status === MarkerStatusEnum.Apply">
      <a-form-item label="企业logo" v-bind="validateInfos.makerPicUrl">
        <a-upload
          :show-upload-list="false"
          v-model:fileList="fileList"
          :max-count="1"
          class="avatar-uploader"
          :before-upload="beforeUpload"
          accept=".png,.jpg">
          <div class="h-[140px] w-[224px] mita-border-dashed">
            <Image v-if="model.makerPicUrl" :pic-url="model.makerPicUrl" class="h-full w-full"></Image>
            <div v-else class="h-full text-[#cccccc] flex-col-center">
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined class="text-xl" v-else></plus-outlined>
              <div class="mt-2">上传图片</div>
            </div>
          </div>
        </a-upload>
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
          v-model:value="model.serviceTagIdList"
          placeholder="请选择服务"
          mode="multiple"
          :options="
            tags.filter((e) => e.tagType === UserTagsType.Service).map((e) => ({ label: e.name, value: e.id }))
          "></a-select>
      </a-form-item>
      <a-form-item label="行业领域" v-bind="validateInfos.sectorTagId">
        <a-select
          v-model:value="model.sectorTagId"
          :options="tags.filter((e) => e.tagType === UserTagsType.Industry).map((e) => ({ label: e.name, value: e.id }))"
          placeholder="请选择标签"></a-select>
      </a-form-item>
      <a-form-item label="标签" v-bind="validateInfos.makerSelfLabel">
        <a-select v-model:value="model.makerSelfLabel" placeholder="请选择标签" mode="tags"></a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 2 }">
        <a-button type="primary" @click.prevent="onSubmit" size="large" class="w-[164px]">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { UploadProps, UploadFile } from "ant-design-vue"

const props = defineProps<{ detail: MakerInfo | null }>()
const { detail } = toRefs(props)
const { data: tags } = await useAsyncData(() => getUserTagList(), {
  server: false,
  default: () => []
})
const { useForm } = Form

const labelCol = { span: 2 }
const wrapperCol = { span: 14 }
const model = reactive<MakerForm>(
  (() => {
    const initModel = {
      makerName: "",
      makerWebsite: "",
      makerIntroduction: "",
      makerPicUrl: "",
      status: 0,
      serviceTagIdList: [],
      makerSelfLabel: [],
      sectorTagId: undefined
    }
    Object.keys(initModel).forEach((k) => {
      const key = k as keyof MakerForm
      if (detail.value?.[key]) {
        initModel[key] = detail.value?.[key] as never
      }
    })
    return initModel
  })()
)
const fileList = ref<UploadFile[]>([])

const rulesRef = reactive({
  makerName: [
    {
      required: true,
      message: "请填写企业名称"
    }
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
      message: "请填写企业简介"
    }
  ]
})
const { loading, runAsync: upload } = useRequest(uploadFile, { manual: true })
const { loading: createLoading, run: create } = useRequest(createMaker, {
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
const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
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
const onSubmit = () => {
  Message.confirm({ message: "确认提交后，一个月内无法编辑修改" })
  validate()
    .then(() => {
      const params = toRaw(model)

      if (detail.value?.status === MarkerStatusEnum.Not) {
        Message.confirm({ message: "确认提交后，一个月内无法编辑修改" }).then(() => {
          create(params)
        })
      } else if (detail.value?.updateFlag) {
        update(params)
      }
    })
    .catch((err) => {
      console.log("error", err)
    })
}
</script>
<style lang="postcss" scoped>
/* .avatar-uploader {
  :deep(.ant-upload) {
    @apply h-[140px] w-[224px];
  }
} */
</style>

