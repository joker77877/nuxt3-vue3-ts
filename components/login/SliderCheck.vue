<template>
  <div class="drag" ref="dragDiv">
    <div class="drag_bg" ref="dragBg"></div>
    <div class="drag_text" ref="dragText">{{ confirmWords }}</div>
    <div
      ref="moveDiv"
      @mousedown="mouseDownFn($event)"
      :class="{ handler_ok_bg: confirmSuccess }"
      class="handler handler_bg flx-center"
      style="position: absolute; top: -1px; left: -1px">
      <icon-arrow-right class="base-icon"></icon-arrow-right>
    </div>
  </div>
</template>

<script setup lang="ts">
// 距离屏幕左端距离
const beginClientX = ref(0)
// 触发拖动状态  判断
const mouseMoveState = ref(false)
// 拖动最大宽度，依据滑块宽度算出来的
const maxWidth = ref("")
// 滑块文字
const confirmWords = ref("请按住滑块，拖动到最右边")
// 验证成功判断
const confirmSuccess = ref(false)
const dragDiv = ref(null)
const dragBg = ref(null)
const dragText = ref(null)
const moveDiv = ref(null)

const emit = defineEmits(["status-changed"])

const mouseDownFn = (e: any) => {
  if (!confirmSuccess.value) {
    e.preventDefault && e.preventDefault() // 阻止文字选中等 浏览器默认事件
    mouseMoveState.value = true
    beginClientX.value = e.clientX
  }
}
// 验证成功函数
const successFunction = () => {
  confirmSuccess.value = true
  confirmWords.value = "验证通过"
  document.getElementsByTagName("html")[0].removeEventListener("mousemove", mouseMoveFn)
  document.getElementsByTagName("html")[0].removeEventListener("mouseup", moseUpFn)
  ;(dragText.value as any)!.style.color = "#fff"
  ;(moveDiv.value as any).style.left = `${maxWidth.value}px`
  ;(dragBg.value as any).style.width = `${maxWidth.value}px`

  emit("status-changed", "success")
}
// mousemove事件
const mouseMoveFn = (e: any) => {
  if (mouseMoveState.value) {
    let width = e.clientX - beginClientX.value
    if (width > 0 && width <= Number(maxWidth.value)) {
      ;(moveDiv.value as any).style.left = `${width}px`
      ;(dragBg.value as any).style.width = `${width}px`
    } else if (width > Number(maxWidth.value)) {
      successFunction()
    }
  }
}
// mouseup事件
const moseUpFn = (e: any) => {
  mouseMoveState.value = false
  const width = e.clientX - beginClientX.value
  if (width < Number(maxWidth.value)) {
    ;(moveDiv.value as any).style.left = `${0}px`
    ;(dragBg.value as any).style.width = `${0}px`
  }
}
onMounted(() => {
  maxWidth.value = String((dragDiv.value as any)!.clientWidth - (moveDiv.value as any)!.clientWidth - 1)
  document.getElementsByTagName("html")[0].addEventListener("mousemove", mouseMoveFn)
  document.getElementsByTagName("html")[0].addEventListener("mouseup", moseUpFn)
})
</script>
<style scoped>
.drag {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 39px;
  line-height: 38px;
  text-align: center;
  background-color: rgb(204 204 204 / 20%);
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.handler {
  box-sizing: border-box;
  width: 46px;
  height: 38px;
  cursor: move;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.handler_bg {
  background: #ffffff;
}
.handler_ok_bg {
  background: #ffffff;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.drag_bg {
  width: 0;
  height: 38px;
  background-color: #0cc399;
  border-radius: 4px 0 0 4px;
}
.drag_text {
  position: absolute;
  top: 0;
  width: 100%;
  font-size: var(--el-font-size-base);
  font-weight: 400;
  color: var(--el-color-info-light-3);
  text-align: center;
  user-select: none;
}
</style>
