<template>
  <div class="relative h-full w-full overflow-hide" ref="canvasRef">
    <canvas class="transparent-bg h-full w-full outline-none" :id="canvasId"></canvas>
    <div class="absolute bottom-[14px] left-0 w-[100%] px-[36px]" v-if="totalFrame > 0">
      <a-slider
        v-model:value="modelCurrentFrame"
        :min="0"
        :max="totalFrame"
        @change="changeAnimationFrameHandle(modelCurrentFrame)"></a-slider>
      <div class="flx-justify-between">
        <div class="flx-align-center gap-[20px]">
          <icon-pause
            class="p-[5px] bg-[#232833]/[0.5] cursor-pointer rounded-[4px] text-white"
            v-if="isPlaying"
            @click="setAnimationPlaying(false)"></icon-pause>
          <icon-play
            class="p-[5px] bg-[#232833]/[0.5] cursor-pointer rounded-[4px] text-white"
            v-else
            @click="setAnimationPlaying(true)"></icon-play>
          <span class="p-[5px] bg-[#232833]/[0.5] rounded-[4px] text-white">{{ currentTime }}</span>
        </div>
        <icon-zoom class="cursor-pointer" @click="toggle"></icon-zoom>
      </div>
    </div>
    <icon-zoom v-else class="absolute bottom-4 right-5 cursor-pointer" @click="toggle"></icon-zoom>
    <div class="absolute top-0 h-full w-full" v-if="loading">
      <NuxtImg v-if="props.picUrl" :src="props.picUrl" alt="" class="w-full blur-[8px]"></NuxtImg>
      <div class="absolute top-0 h-full w-full flex-col-center">
        <span class="mb-3 text-white">loading 3d model</span>
        <el-progress class="w-[224px]" :percentage="percent" :show-text="false"></el-progress>
      </div>
    </div>
    <div v-if="imgUrl" class="thumbnail">
      <img :src="imgUrl" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(["engineChanged", "snapshot"])
const props = defineProps<{
  canvasId?: string
  fileUrl: string
  picUrl?: string
  type: 1 | 2
  modelConfiguration?: Object
  getThumbnail?: (p: string, m: string) => void
  saveDefaultConfig?: (config: Object) => void
}>()
let canvasRef = ref()
const isPlaying = ref(false)
const modelCurrentFrame = ref(0)
const totalFrame = ref(0)
let loading = ref(true)
let percent = ref(0)
const canvasId = ref(props.canvasId || "renderCanvas")
const { toggle } = useFullscreen(canvasRef)
let meta3DEngine: Meta3DEngineType | null = null
const renderCanvasRef = ref()
const imgUrl = ref()
const currentTime = computed(() => secondsToHms(modelCurrentFrame.value))
watch(
  () => props.fileUrl,
  (url) => {
    if (meta3DEngine && url) {
      loading.value = true
      meta3DEngine?.loadModelUrl(url)
    }
  }
)

const setAnimationPlaying = (status: boolean) => {
  console.log(status ? "播放动画" : "停止动画", status)
  meta3DEngine?.setAnimationParam("isPlaying", status)
  isPlaying.value = status
}

const changeAnimationFrameHandle = (frame: number) => {
  meta3DEngine?.setAnimationParam("currentFrame", frame)
}

const getModelEditorSetting = () => {
  return meta3DEngine?.getEditorSettingParamToFrontEnd()
}

onMounted(async () => {
  import("@/utils/meta3dBuild/meta3DEngine").then(({ default: Meta3D }) => {
    meta3DEngine = new Meta3D(canvasId.value) // renderCanvas为canvas的id
    if (meta3DEngine) {
      console.log("获取到engine", props.modelConfiguration, meta3DEngine)
      if (props?.modelConfiguration) {
        meta3DEngine?.presetsInitialParam(props.modelConfiguration)
      }
      emit("engineChanged", meta3DEngine)
      meta3DEngine?.init() // 初始化
      if (props.fileUrl) {
        loading.value = true
        meta3DEngine?.loadModelUrl(props.fileUrl)
      }
      meta3DEngine.onSceneLoaded.add(async () => {
        loading.value = false
        percent.value = 0
        const animationInfo = meta3DEngine?.getModelAnimationInfo()
        console.log("打印模型动画帧", animationInfo)
        if (animationInfo) {
          isPlaying.value = animationInfo.isPlaying
          modelCurrentFrame.value = animationInfo.currentFrame
          totalFrame.value = animationInfo.to
          meta3DEngine?.addAnimationListen(({ currentFrame }) => {
            modelCurrentFrame.value = currentFrame
          })
        }
        // 上传模型
        if (props.type === RenderCanvasTypeEnum.Upload) {
          let base64url = await meta3DEngine?.getScreenshot(660, 440)
          let modelInfo = await meta3DEngine?.getModelInfo()
          if (props?.saveDefaultConfig) {
            const config: any = getModelEditorSetting()
            console.log("保存模型默认配置")
            props?.saveDefaultConfig(config)
          }
          if (base64url) {
            props?.getThumbnail?.(base64url, JSON.stringify(modelInfo))
          }
        }
      })
      meta3DEngine.onLoadedError.add(() => {
        loading.value = false
      })
      meta3DEngine?.onSceneProgressed.add((e) => {
        percent.value = Math.round((e.loaded / e.total) * 100)
      })
      renderCanvasRef.value = (meta3DEngine as any).canvasDom
    }
  })
})

onBeforeUnmount(() => {
  meta3DEngine?.dispose()
  meta3DEngine = null
})

const saveModelPicHandle = async () => {
  imgUrl.value = await meta3DEngine?.getScreenshot(660, 440)
  emit("snapshot", imgUrl.value)
  setTimeout(() => {
    imgUrl.value = null
  }, 3000)
}

defineExpose({
  saveModelPicHandle,
  getModelEditorSetting
})
</script>

<style lang="scss">
.overflow-hide {
  overflow: hidden;
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
.transparent-bg {
  background-image: linear-gradient(45deg, #cccccc 25%, transparent 0, transparent 75%, #cccccc 0, #cccccc),
    linear-gradient(45deg, #cccccc 25%, transparent 0, transparent 75%, #cccccc 0, #cccccc);
  background-position:
    0 0,
    4px 4px;
  background-size: 8px 8px;
}
</style>
