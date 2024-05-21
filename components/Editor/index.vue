<template>
  <div :class="['editor-box', disabled ? 'editor-disabled' : '']">
    <WeToolbar
      v-if="!hideToolBar"
      class="editor-toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"></WeToolbar>
    <WeEditor
      v-model="valueHtml"
      class="editor-content"
      :style="{ height }"
      :mode="mode"
      :default-config="editorConfig"
      @on-created="handleCreated"></WeEditor>
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import { IToolbarConfig, IEditorConfig } from "@wangeditor/editor"
import { uploadImg } from "@/api/modules/upload"
import "@wangeditor/editor/dist/css/style.css"
// import { formContextKey, formItemContextKey } from "element-plus"

// 富文本 DOM 元素
const editorRef = shallowRef()

// 接收父组件参数，并设置默认值
interface RichEditorProps {
  value: string // 富文本值 ==> 必传
  toolbarConfig?: Partial<IToolbarConfig> // 工具栏配置 ==> 非必传（默认为空）
  editorConfig?: Partial<IEditorConfig> // 编辑器配置 ==> 非必传（默认为空）
  height?: string // 富文本高度 ==> 非必传（默认为 500px）
  mode?: "default" | "simple" // 富文本模式 ==> 非必传（默认为 default）
  hideToolBar?: boolean // 是否隐藏工具栏 ==> 非必传（默认为false）
  disabled?: boolean // 是否禁用编辑器 ==> 非必传（默认为false）
}
const props = withDefaults(defineProps<RichEditorProps>(), {
  toolbarConfig: () => {
    return {
      excludeKeys: []
    }
  },
  editorConfig: () => {
    return {
      placeholder: "请输入内容...",
      MENU_CONF: {
        uploadImage: {
          /**
           * @description 图片自定义上传
           * @param file 上传的文件
           * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
           * */
          async customUpload(file: File, insertFn: any) {
            // if (!uploadImgValidate(file)) return
            try {
              const hash = await getFileHash(file)
              const { fileResourceUrlsRespList } = await uploadImg({
                multipartFile: file,
                type: UploadFileResTypeEnum.General,
                fHash: hash
              })
              const [pic] = fileResourceUrlsRespList
              insertFn(pic.fileURL)
            } catch (error) {
              console.log(error)
            }
          }
        },
        onError() {
          ElMessage.error("图片上传失败，请重新上传")
        }
      },
      autoFocus: false
    }
  },
  height: "300px",
  mode: "simple",
  hideToolBar: false,
  disabled: false
})
/**
 * @description: 实列化编辑器
 * @param {any} editor
 * @return {*}
 */
const handleCreated = (editor: any) => {
  editorRef.value = editor
}
watchEffect(() => {
  // 判断当前富文本编辑器是否禁用
  if (editorRef.value && props.disabled) {
    editorRef.value.disable()
  }
})
// 富文本的内容监听，触发父组件改变，实现双向数据绑定
const emit = defineEmits<{
  "update:value": [value: string]
  checkValidate: []
}>()
const valueHtml = computed({
  get() {
    return props.value
  },
  set(val: string) {
    let value = val
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) {
      value = ""
    }
    emit("update:value", value)
    // emit("checkValidate")
  }
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  if (!editorRef.value) return
  editorRef.value.destroy()
})

defineExpose({
  editor: editorRef
})
</script>

<style scoped lang="scss">
/* 富文本组件校验失败样式 */
.is-error {
  .editor-box {
    border-color: var(--el-color-danger);
    .editor-toolbar {
      border-bottom-color: var(--el-color-danger);
    }
  }
}

/* 富文本组件禁用样式 */
.editor-disabled {
  cursor: not-allowed !important;
}

/* 富文本组件样式 */
.editor-box {
  /* 防止富文本编辑器全屏时 tabs组件 在其层级之上 */
  z-index: 0;
  width: 100%;
  border: 1px solid var(--el-border-color-darker);
  .editor-toolbar {
    border-bottom: 1px solid var(--el-border-color-darker);
  }
  .editor-content {
    overflow-y: hidden;
  }
}
</style>
