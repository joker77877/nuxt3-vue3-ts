import { createVNode, render } from "vue"
import MessageBox from "./MessageBox.vue"

let container: any

const createContainer = () => {
  container = document.createElement("div")
  document.body.appendChild(container)
}

function destroyContainer() {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container)
    container = null
  }
}

export type MessageType = "warning" | "success" | "confirm"

export interface Options {
  icon?: string // svg图标名称
  title?: string // 提示标题
  message?: string | VNode // 提示说明
  okText?: string // 确认按钮文本
  cancelText?: string // 取消按钮文本
  showOk?: boolean // 是否显示确定按钮
  showCancel?: boolean // 是否显示取消按钮
}

const showMessage = (type: MessageType, options: Options) => {
  if (!container) {
    createContainer()
  }

  return new Promise<void>((resolve, reject) => {
    const vnode = createVNode(MessageBox, {
      type,
      ...options,
      onConfirm: (isOk: boolean) => {
        if (isOk) {
          resolve()
        } else {
          reject()
        }
      },
      onClose: () => {
        destroyContainer()
      }
    })

    render(vnode, container)
  })
}

/**
 * js调用显示提示框
 * 配置见Options
 * 返回promise。then表示点击确定，其余为catch
 * 示例
 * Message.warning({
    title: "确定要删除该作品收藏夹么？",
    message: "确定要删除该作品收藏夹么？"
  })
    .then(() => {
      ElMessageBox({
        message: "删除成功"
      })
    })
    .catch(() => {
      ElMessageBox({
        message: "删除失败"
      })
    })
 */
const Message = {
  /**
   * 红色主题、默认三角叹号图标
   */
  warning: (options: Options) => showMessage("warning", options),
  /**
   * 绿色主题、默认圆形对勾图标
   */
  success: (options: Options) => showMessage("success", options),
  /**
   * 绿色主题、默认圆形叹号图标
   */
  confirm: (options: Options) => showMessage("confirm", options)
}

export default Message
