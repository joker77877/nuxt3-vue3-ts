<template>
  <div class="header flx-justify-between pl40 pr20 bg-dark">
    <div class="header-left flx-align-center">
      <icon-logo-small class="hover-pointer" @click="goHome"></icon-logo-small>
      <div class="header-box flx-center ml15 pl20 pr20">
        <span class="tips ml20">当前正在编辑</span>
        <span class="model-name ml10">{{ modelName }}</span>
      </div>
    </div>
    <div class="header-right">
      <el-button class="quit-btn mr22" @click="goBack()">退出</el-button>
      <el-button type="primary" class="save-btn" @click="saveModelConfigHandle">保存设置</el-button>
    </div>
  </div>
  <div class="editor">
    <div class="left-wrapper">
      <ConfigItem
        :config-item="modelConfigData"
        :engine="engine"
        :find-node="findTargetNodeHandle"
        @change="hasEdited = true"></ConfigItem>
    </div>
    <div class="right-wrapper flx-center">
      <RenderCanvas
        v-if="canvasFileUrl"
        ref="renderCanvasRef"
        :pic-url="picUrl"
        :file-url="canvasFileUrl"
        :type="RenderCanvasTypeEnum.Default"
        :model-configuration="modelConfiguration"
        @snapshot="saveModelPicHandle"
        @engine-changed="engineChanged"></RenderCanvas>
      <el-button class="save-cover" type="primary" @click="triggerModelPicHandle">
        <icon-search class="mr10"></icon-search>
        保存视图为封面
      </el-button>
    </div>
  </div>
  <a-modal v-model:open="openDialog" title="Basic Modal" @ok="router.back()">
    <p>系统可能不会保存您所做的更改。</p>
  </a-modal>
</template>
<script setup lang="ts">
import { modelConfig } from "./config"
import { childDisabledHandle } from "./utils"

interface ModelConfiguration {
  [key: string]: any
}

const route = useRoute()
const router = useRouter()
const hasEdited = ref(false)
const fileResourceId = ref(route.params.id)
const proId = ref(route.query.proId)
const isLimited = ref(route.query.isLimited)
const modelConfigData = ref<ModelConfigItem>(modelConfig)
const modelName = ref("")
const picUrl = ref("")
const canvasFileUrl = ref("")
const modelConfiguration = ref<ModelConfiguration>({})
const renderCanvasRef = ref<any>()
const openDialog = ref(false)
const engine = ref<Meta3DEngineType>()

const { runAsync: getInfo } = useRequest(getResourceInfo, {
  manual: true,
  onError() {
    navigateTo("/404")
  }
})

const backgroundColorNode = computed(() => getSubNodesByKey(modelConfigData.value, "category", "background.color")?.[0])
watch(
  () => backgroundColorNode.value,
  (target) => {
    if (!engine.value) return
    backgroundColorNode.value.changeHandle(engine.value, target.value.hex)
  },
  {
    deep: true
  }
)

const findTargetNodeHandle = (key: string, val: any) => {
  return getSubNodesByKey(modelConfigData.value, key, val)[0]
}

const changeEnvironmentNameHandle = (name: string) => {
  const [bgEnvTargetNode] = getSubNodesByKey(modelConfigData.value, "key", "currentEnvironment")
  bgEnvTargetNode.text = name
}

const setDefaultListData = () => {
  const [bgImgTargetNode] = getSubNodesByKey(modelConfigData.value, "key", "bg-image-list")
  bgImgTargetNode.options = engine.value?.getSceneBackgroundImageResourcesData()
  // 渲染场景环境球资源数据
  const [resourceTargetNode] = getSubNodesByKey(modelConfigData.value, "category", "environment.id")
  resourceTargetNode.options = engine.value?.getSceneEnvironmentResourcesData()
  // 更新场景环境球选中资源
  const selectedId = resourceTargetNode.selectedOption?.id
  resourceTargetNode.selectedOption = resourceTargetNode.options.find((item: any) => item.id === selectedId)
  // 更新背景--环境--当前环境
  changeEnvironmentNameHandle(resourceTargetNode.selectedOption?.name)
}

const setDefaultValueHandle = () => {
  const targetNodes = flattenTree(modelConfigData.value, "category")
  Object.entries(targetNodes).forEach(([keyPath, node]) => {
    const nodeVal = getNestedPropertyValue(modelConfiguration.value, keyPath)
    if (nodeVal !== undefined && !(typeof nodeVal === "object" && nodeVal !== null)) {
      if (Object.getOwnPropertyDescriptor(node, "enable")) {
        node.enable = nodeVal
        childDisabledHandle(node, !nodeVal)
      } else if (Object.getOwnPropertyDescriptor(node, "value")) {
        node.value = nodeVal
      } else if (Object.getOwnPropertyDescriptor(node, "activeTab")) {
        node.activeTab = nodeVal
      } else if (Object.getOwnPropertyDescriptor(node, "selectedOptionId")) {
        node.selectedOptionId = nodeVal
      } else if (Object.getOwnPropertyDescriptor(node, "selectedOption")) {
        node.selectedOption = node.options.find((option: any) => option.id === nodeVal)
      }
    }
  })
}

const engineChanged = (newEngine: Meta3DEngineType) => {
  engine.value = newEngine
  if (Object.keys(modelConfiguration.value).length === 0) {
    nextTick(() => {
      modelConfiguration.value = renderCanvasRef.value.getModelEditorSetting()
      setDefaultValueHandle()
      setTimeout(() => {
        setDefaultListData()
      })
    })
  } else {
    setDefaultListData()
  }
}

const triggerModelPicHandle = () => {
  renderCanvasRef.value.saveModelPicHandle()
}

// 更新模型配置信息
const saveModelConfigHandle = async () => {
  const config = renderCanvasRef.value.getModelEditorSetting()
  await updateSpuModelConfig({
    fileResourceId: fileResourceId.value as string,
    editInfo: JSON.stringify(config)
  })
  hasEdited.value = false
  message.success("更新成功")
}

// 保存缩略图
const saveModelPicHandle = async (newPicUrl: string) => {
  try {
    let formData: any = new FormData()
    let reg = /data:image\/(?<ext>.*?);base64,.*/
    let regRes = reg.exec(newPicUrl)
    const ext = regRes?.groups?.ext || "png"
    const name = modelName.value.split(".") || []
    const fileName = `${name}.${ext}`
    const file = base64UrlToFile(newPicUrl, fileName)
    console.log("保存缩略图", newPicUrl, file)
    const hash = await getFileHash(file)
    formData.append("fileResourceId", fileResourceId.value)
    formData.append("multipartFile", file)
    formData.append("type", UploadFileResTypeEnum.COVER)
    formData.append("fHash", hash)
    formData.append("isBlock", 0)
    formData.append("coverImageType", 1)
    await updateSpuPicUrl(formData)
    saveModelConfigHandle()
  } catch (err) {
    message.error("更新封面图失败")
  }
}

const getConfiguration = async () => {
  const data = await getInfo({
    fileResourceId: fileResourceId.value
  })
  const [canvas, pic] = data.fileResourceUrlsList
  modelName.value = data?.name
  // 模型地址
  canvasFileUrl.value = canvas.gltfFileURL || canvas.fileURL
  // 模型封面图
  picUrl.value = pic?.fileURL
  // 模型配置
  if (data.editInfo) {
    modelConfiguration.value = JSON.parse(data.editInfo)
    setDefaultValueHandle()
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (route.name !== "assetsEditor") return
    fileResourceId.value = id
    getConfiguration()
  }
)

onMounted(() => {
  getConfiguration()
})

const goBack = () => {
  if (hasEdited.value) {
    openDialog.value = true
  } else if (proId.value) {
    // 返回修改草稿页面
    console.log(`返回${isLimited.value === "true" ? "藏品" : "资产"}编辑页`)
    const url = isLimited.value === "true" ? `/limit-asset/edit/${proId.value}` : `/works/${proId.value}`
    navigateTo(url)
  } else {
    router.back()
  }
}

const goHome = () => {
  if (hasEdited.value) {
    openDialog.value = true
  } else {
    navigateTo("/")
  }
}
</script>
<style lang="scss" scoped>
.header {
  height: 80px;
  &.bg-dark {
    color: #ffffff;
    background-color: var(--el-text-color-regular);
  }
  .header-box {
    height: 43px;
    background: linear-gradient(270deg, rgb(233 243 255 / 0%) 0%, rgb(255 255 255 / 10%) 54.8%, rgb(216 241 255 / 0%) 109.6%);
    border-radius: 54px;
    .tips {
      font-size: var(--el-font-size-base);
      font-weight: 400;
      line-height: 22px;
    }
    .model-name {
      font-size: var(--el-font-size-base);
      font-weight: 500;
      line-height: 22px;
      color: #ffffff;
    }
  }
  .header-right {
    .quit-btn,
    .save-btn {
      width: 75px;
      height: 28px;
      font-size: var(--el-font-size-extra-small);
      font-style: normal;
      font-weight: 400;
      color: #ffffff;
      text-transform: capitalize;
      border-radius: 4px;
    }
    .quit-btn {
      background: none;
      border: 1px solid #ffffff;
    }
  }
}
.editor {
  display: flex;
  height: calc(100vh - 80px);
  .left-wrapper {
    width: 300px;
    max-height: 100%;
    overflow: auto;
    color: #ffffff;
    background: var(--el-text-color-regular);
    &:hover {
      // overflow-y: auto;
    }
    .subTitle {
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #ffffff;
    }
  }
  .right-wrapper {
    position: relative;
    flex: 1;
    background-image: url("../../assets/images/editor/editor-bg.png");
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 100% 100%;
    .save-cover {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
    }
    .thumbnail {
      position: fixed;
      top: 140px;
      left: 320px;
      z-index: 99999;
      display: block;
      border: 8px solid #ffffff;
      border-radius: 5px;
      img {
        display: block;
        width: 260px;
        height: 176px;
        border-radius: 5px;
      }
    }
  }
}
:deep(.vc-sketch) {
  width: 100%;
  padding: 0;
  box-shadow: none;
  .vc-botton-container {
    display: none;
  }
}
:deep(.left-wrapper .el-tabs--border-card) {
  background: var(--el-text-color-regular);
  border: none;
  .el-tabs__header {
    border-bottom: none;
    .el-tabs__item {
      &:not(:last-child) {
        border-right: 1px solid #546285;
      }
      &.is-active {
        color: #ffffff;
        background: #115ee8;
        border: none;
      }
    }
  }
  .el-tabs__nav-scroll {
    background-color: var(--el-text-color-regular);
  }
  .el-tabs__content {
    padding: 0;
    .el-collapse {
      border: none;
    }
  }
  .el-collapse-item {
    .el-collapse-item__header {
      height: 42px;
      padding-right: 18px;
      padding-left: 36px;
      color: #ffffff;
      background: #343f59;
      border-color: #2c3852;
      .el-collapse-item__arrow {
        position: absolute;
        left: 18px;
      }
    }
    .el-collapse-item__wrap {
      padding: 20px 20px 0;
      background-color: var(--el-text-color-regular);
      border: none;
    }
    .el-collapse {
      .el-collapse-item__header {
        border-radius: 4px;
        .el-collapse-item__arrow {
          left: 38px;
        }
      }
      .el-collapse-item__wrap {
        padding-right: 0;
        padding-left: 0;
        background: none;
      }
    }
  }
  .el-checkbox {
    color: #ffffff;
  }
  .slider-val {
    padding-left: 10px;
    border: none;
    .el-input-number {
      width: 80px;
    }
    .el-input__wrapper {
      position: relative;
      width: 71px;
      height: 26px;
      padding-right: 8px;
      padding-left: 8px;
      background: none;
      background-image: linear-gradient(to right, #232833, #232833), linear-gradient(-90deg, #1e6bff, #c73ad4, #f45a76);
      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      border: 1px solid transparent;
      border-radius: 4px;
      box-shadow: none;
      input {
        color: #ffffff;
      }
    }
  }
  .el-switch .el-switch__core {
    background-color: #5b5b5b;
    border-color: #5b5b5b;
  }
  .el-switch.is-checked .el-switch__core {
    background-color: #115ee8;
    border-color: #115ee8;
  }
  .el-slider {
    .el-slider__runway {
      height: 10px;
      background-color: #30343d;
      border-radius: 5px;
      .el-slider__bar {
        height: 10px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      .el-slider__button-wrapper {
        top: -13px;
      }
    }
    .el-slider__button {
      width: 18px;
      height: 18px;
      border-color: #f45aa2;
      border-width: 4px;
    }
    .el-slider__bar {
      background: linear-gradient(270deg, #ff3af7 0%, #4f40ff 100%);
    }
  }
  .el-color-picker__trigger {
    padding: 0;
    border: none;
    box-shadow: 0 2px 1.8px 0 rgb(130 130 130 / 36%);
    .el-color-picker__color {
      border: none;
    }
    .el-color-picker__color-inner {
      border-radius: 3px;
    }
  }
  .background-tabs {
    .el-tabs__nav-scroll {
      background-color: #1d2433;
      border-radius: 4px 4px 0 0;
    }
    .el-tabs__item {
      padding: 0;
      color: #ffffff;
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
  .el-collapse-item__content {
    .el-tabs__nav-scroll {
      background-color: #1d2433;
      border-radius: 4px 4px 0 0;
      .el-tabs__active-bar {
        display: none;
      }
      .el-tabs__item {
        padding: 0;
        color: #999999;
        &.is-active {
          background-color: #3f4d6d;
        }
      }
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
  }
  .gray-filter {
    filter: grayscale(100%);
    .slider-val .el-input__wrapper {
      background: none;
      border: 1px solid #545454;
      input {
        color: #9f9f9f;
      }
    }
    .el-slider__button {
      background-color: #545454;
      border-color: #4a4a4a;
    }
    .el-collapse {
      .el-collapse-item__header {
        .el-collapse-item__arrow {
          left: 18px !important;
        }
      }
    }
  }
}
</style>
