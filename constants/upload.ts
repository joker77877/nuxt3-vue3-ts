
export const FLOOT_REGEX = {
  pattern: /^(0?\.\d{1,2}|[1-9]\d*(\.\d{1,2})?)$/,
  message: "请输入大于0的整数或者带有两位小数的数字"
}
export const NOT_ONLY_WHITESPACE = {
  pattern: /^(?![\s\n\r]+$)[\s\S]*\S[\s\S]*$/,
  message: "不能输入只有空格的内容"
}
