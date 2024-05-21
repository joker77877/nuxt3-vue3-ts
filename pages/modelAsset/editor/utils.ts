/**
 * 设置节点是否禁用
 * @param node 目标节点
 * @param disabled disabled值
 */
export const childDisabledHandle = (node: ModelConfigItem, disabled: boolean) => {
  node.children?.forEach((child: ModelConfigItem) => {
    if (Object.getOwnPropertyDescriptor(child, "disabled")) {
      child.disabled = disabled
    }
    if (Object.getOwnPropertyDescriptor(child, "children")) {
      childDisabledHandle(child, disabled)
    }
  })
}
