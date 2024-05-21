/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = ""
  for (let i = 0; i < 32; i += 1) {
    let random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-"
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
  let defaultBrowserLang = ""
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = "zh"
  } else {
    defaultBrowserLang = "en"
  }
  return defaultBrowserLang
}

/**
 *生成常量
 * @param dict
 * @returns
 */
export const generatorConstant = <V>(dict: Array<{ [key: string]: IInputItemType<V> }>): IOutConstantType<V> => {
  let constantCollect: IOutConstantType<V> = {} as IOutConstantType<V>
  constantCollect.KEY_VALUE = {}
  constantCollect.VALUE_LABEL = {}
  constantCollect.VALUE_COLOR = {}
  constantCollect.VALUE_TIPS = {}
  constantCollect.SELECT_OPTIONS = []

  dict.forEach((configItem) => {
    Object.keys(configItem).forEach((key) => {
      let { label, value, color, tips, hidden } = configItem[key]
      constantCollect[key] = value
      constantCollect.KEY_VALUE[key] = value
      constantCollect.VALUE_LABEL[value] = label
      constantCollect.VALUE_COLOR[value] = color
      constantCollect.VALUE_TIPS[value] = tips
      if (!hidden) {
        constantCollect.SELECT_OPTIONS.push(configItem[key])
      }
    })
  })
  return constantCollect
}
