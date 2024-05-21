/**
 * 帧转换为时分秒，一分是60帧
 * @param seconds
 * @returns
 */
export function secondsToHms(seconds: number) {
  let hours: number = Math.floor(seconds / 3600)
  let sHours = hours < 10 ? `0${hours}` : hours
  let minutes = Math.floor((seconds % 3600) / 60)
  let sMinutes = minutes < 10 ? `0${minutes}` : minutes
  let secs = Math.ceil(seconds % 60)
  let sSecs = secs < 10 ? `0${secs}` : secs

  return [sHours, sMinutes, sSecs].join(":").replace(/^00:/, "")
}

/**
 * 查找树结构对象中包含指定属性的子对象进行扁平化
 */
export interface TreeNode {
  [key: string]: any
  children?: TreeNode[]
}

// 将base64转换为文件
export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",")
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length - 1
  let u8arr = new Uint8Array(n)

  while (n) {
    u8arr[n] = bstr.charCodeAt(n)
    n -= 1
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * 获取对象中以点分隔的子属性值
 * @param obj 目标对象
 * @param path 以点分割的属性名路径
 * @returns 返回对应属性值
 */
export function getNestedPropertyValue(obj: Object, path: string) {
  return path.split(".").reduce((o, prop): any => o && (o as any)[prop], obj)
}

/**
 * 获取树结构对象中键字段为特定值的子节点
 * @param tree 目标对象
 * @param key 指定键字段
 * @param value 指定键字段值
 * @returns 目标子节点
 */
export function getSubNodesByKey(tree: TreeNode, key: string, value: any) {
  let result: TreeNode[] = []
  ;(function recurse(nodes: TreeNode[]) {
    nodes.forEach((node: TreeNode) => {
      if (node[key] === value) {
        result.push(node)
      }
      if (node.children) {
        recurse(node.children)
      }
    })
  })([tree])

  return result
}

/**
 * 从树结构对象中获取指定属性的节点
 * @param tree 节点对象
 * @param propertyName 指定属性名
 * @returns 返回包含指定属性名对应节点的一级对象
 */
export function flattenTree(tree: TreeNode, propertyName?: string): TreeNode {
  let result: any = {}

  function flatten(node: TreeNode) {
    if (propertyName && Object.getOwnPropertyDescriptor(node, propertyName)) {
      const keyName = propertyName === "value" ? "key" : propertyName
      result[node[keyName]] = node
    }

    if (node.children) {
      node.children.forEach((child) => {
        flatten(child)
      })
    }
  }

  flatten(tree)

  return result
}

/**
 * 字符串中间显示省略号
 * @param str 需处理的字符串
 * @param maxLength 默认最多展示多少个字符
 * @returns string
 */
export function ellipsisStr(str: string, maxLength = 4, isPhone?: boolean) {
  if (str.length <= maxLength) {
    return str
  }
  const startLength = Math.ceil(maxLength / 2)
  const endLength = Math.ceil(maxLength / 2)
  return str.slice(0, startLength) + (isPhone ? "***" : "...") + str.slice(isPhone ? -4 : -endLength)
}

// 从对象中排除某个属性
interface Result {
  [key: string]: any
}
export function excludeProperty(obj: any, propToExclude: string) {
  return Object.keys(obj)
    .filter((keyName: string) => keyName !== propToExclude)
    .reduce((result: Result, key) => {
      result[key] = obj[key]
      return result
    }, {})
}

// export const downloadFile = async (url: string, fileName: string, type: string) => {
//   const response: any = await DownloadFile(`${url}`)
//   const blob = new Blob([response], { type })
//   const urlObject = window.URL.createObjectURL(blob)
//   const link = document.createElement("a")
//   link.href = urlObject
//   link.download = fileName
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }

export const downloadFile = async (url: string) => {
  const link = document.createElement("a")
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 时间格式化
export function formatDate(timestamp: number, needOption?: boolean) {
  const date = new Date(timestamp)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
    // dateStyle: "short"
  }
  if (needOption) {
    return new Intl.DateTimeFormat("zh-CH", options as any).format(date)
  }
  return new Intl.DateTimeFormat("zh-CH").format(date)
}

export function timeAgo(timestamp: number) {
  const now: any = new Date()
  const past: any = new Date(timestamp)
  const duration = Number(now - past)

  if (Number.isNaN(duration)) {
    return "Invalid Date"
  }

  const seconds = Math.abs(duration / 1000)
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const years = days / 365

  if (years > 1) {
    // formatDate(timestamp) // 显示年月日
    return `${Math.floor(years)}年前`
  }
  if (days >= 1) {
    return `${Math.floor(days)}天前`
  }
  if (hours >= 1) {
    return `${Math.floor(hours)}小时前`
  }
  if (minutes >= 1) {
    return `${Math.floor(minutes)}分钟前`
  }
  if (seconds >= 1) {
    return `${Math.floor(seconds)}秒前`
  }
  return "刚刚"
}

/**
 * @description: 是否登录
 */
export const isLogin = () => Boolean(useAuthStore().accessToken)
