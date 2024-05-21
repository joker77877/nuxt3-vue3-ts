export const FILE_CHUNK_SIZE = 5 * 1024 * 1024
export const FILE_LIMIT_SIZE = 100 * 1024 * 1024
export const FILE_CHUNK_LIMIT_SIZE = 30 * 1024 * 1024
export const IMG_CHUNK_LIMIT_SIZE = 10 * 1024 * 1024
export const FLOOT_REGEX = {
  pattern: /^(0?\.\d{1,2}|[1-9]\d*(\.\d{1,2})?)$/,
  message: "请输入大于0的整数或者带有两位小数的数字"
}
export const NOT_ONLY_WHITESPACE = {
  pattern: /^(?![\s\n\r]+$)[\s\S]*\S[\s\S]*$/,
  message: "不能输入只有空格的内容"
}
export const INTEGER_REGEX = {
  pattern: /^[1-9]\d*$/,
  message: "请输入大于0的整数"
}

export const UPLOAD_DIALOG_MAP = {
  1: {
    content: "该作品已上传，请到个人中心编辑",
    url: ""
  },
  2: {
    content: "该文件已上传，请到个人中心编辑",
    url: ""
  },
  3: {
    content: "",
    url: ""
  },
  4: {
    content: "该作品已被其他用户上传，请勿重新上传",
    url: ""
  }
}
export const PUBLISH_TYPE_LIST = [
  {
    label: "作品出售",
    value: 1
  },
  {
    label: "免费下载",
    value: 2
  },
  {
    label: "只分享不支持下载",
    value: 3
  }
]

export const UPLOAD_PRICE_FORM_ITEM_LIST = ["copyrightPrice", "personalPrice", "enterprisesPrice"]
