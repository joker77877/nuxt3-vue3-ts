<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <a-skeleton-image></a-skeleton-image>
      </template>
      <a-upload-dragger
        :class="['upload', disabled ? 'disabled' : '', !borderStyle ? 'no-border' : '']"
        :multiple="false"
        :max-count="1"
        :disabled="disabled"
        :show-upload-list="false"
        :before-upload="beforeUpload"
        :accept="fileType.join(',')">
        <template v-if="imageUrl">
          <NuxtImg :src="imageUrl" class="upload-image" alt=""></NuxtImg>
          <div
            class="upload-handle absolute top-0 left-0 w-full h-full flex-center cursor-pointer bg-black/60 opacity-0 duration-200">
            <div v-if="!disabled" class="handle-icon">
              <icon-edit></icon-edit>
              <span>编辑</span>
            </div>
            <div class="handle-icon" v-if="needPreview" @click="imgViewVisible = true">
              <icon-eye></icon-eye>
              <span>查看</span>
            </div>
            <div v-if="!disabled && needDelete" class="handle-icon" @click.stop="deleteImg">
              <icon-delete class="w-6 h-6"></icon-delete>
              <span>删除</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="upload-empty">
            <slot name="empty">添加照片</slot>
          </div>
        </template>
      </a-upload-dragger>
      <div class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
      <el-image-viewer
        v-if="imgViewVisible"
        :url-list="imageUrl ? [imageUrl] : []"
        @close="imgViewVisible = false"></el-image-viewer>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface UploadFileProps {
  // imageUrl: string // 图片地址 ==> 必传
  api?: (params: any) => Promise<any> // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number // 图片大小限制 ==> 非必传（默认为 5M）
  fileType?: File.ImageMimeType[] // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height?: string // 组件高度 ==> 非必传（默认为 150px）
  width?: string // 组件宽度 ==> 非必传（默认为 150px）
  borderStyle?: string // 边框
  borderRadius?: string // 组件边框圆角 ==> 非必传（默认为 8px）
  needDelete?: boolean // 是否需要显示删除按钮 ==> 非必传（默认为 true）
  needPreview?: boolean // 是否需要显示查看按钮 ==> 非必传（默认为 true）
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px",
  needDelete: true,
  needPreview: true
})

const imageUrl = defineModel<string>("imageUrl")

// 查看图片
const imgViewVisible = ref(false)
// 判断是否禁用上传和删除
const disabled = computed(() => {
  return props.disabled
})
/**
 * @description 图片上传
 * @param options upload 所有配置项
 * */
const handleHttpUpload = async (file: File) => {
  const hash = await getFileHash(file)
  const params = {
    multipartFile: file,
    type: UploadType.NORMAL,
    fHash: hash
  }
  try {
    const { data } = await uploadFile(params)
    message.success("图片上传成功！")
    const fileUrl = data?.fileResourceUrlsRespList[0].fileURL
    imageUrl.value = fileUrl
    // 调用 el-form 内部的校验方法（可自动校验）
    // formItemContext?.prop && formContext?.validateField([formItemContext.prop as string])
  } catch (error) {
    message.error("图片上传失败，请您重新上传！")
  }
}

/**
 * @description 删除图片
 * */
const deleteImg = () => {
  imageUrl.value = ""
}

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const imgSize = rawFile.size < props.fileSize * 1024 * 1024
  const imgType = props.fileType.includes(rawFile.type as File.ImageMimeType)

  if (!imgType) {
    message.error("上传图片不符合所需的格式！")
    return false
  }
  if (!imgSize) {
    message.error(`上传图片大小不能超过 ${props.fileSize}MB！`)
    return false
  }
  handleHttpUpload(rawFile)
  return false
}
</script>

<style scoped lang="scss">
:deep(.ant-skeleton.ant-skeleton-element .ant-skeleton-image) {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: v-bind(borderRadius);
}
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.ant-upload-drag) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(width);
  height: v-bind(height);
  overflow: hidden;
  border: v-bind(borderStyle);
  border-radius: v-bind(borderRadius);
  transition: var(--el-transition-duration-fast);
  &.no-border {
    border: none;
  }
  .ant-upload {
    padding: 0;
  }
  &:hover {
    border-color: var(--el-color-primary);
    .upload-handle {
      opacity: 1;
    }
  }
  .upload-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: v-bind(borderRadius);
  }
  .upload-empty {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 30px;
    color: var(--el-color-info);
  }
  .upload-handle {
    .handle-icon {
      @apply flex-col-center;

      padding: 0 6%;
      color: aliceblue;
    }
  }
}
</style>
