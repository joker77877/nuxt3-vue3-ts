// ? Element 常用表单校验规则
/**
 * 校验邮箱
 */
export function checkEmail(rule: any, value: string) {
  return new Promise<void>((resolve, reject) => {
    const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
    if (!regex.test(value)) {
      reject(new Error("请输入正确的邮箱"))
    }
    resolve()
  })
}

/**
 * 校验身份证号
 */
export function checkIdCard(rule: any, value: string) {
  return new Promise<void>((resolve, reject) => {
    const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!regex.test(value)) {
      reject(new Error("请输入正确的身份证号"))
    }
    resolve()
  })
}

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any) {
  return new Promise<void>((resolve, reject) => {
    const regexp = /^(((13[\d]{1})|(15[\d]{1})|(16[2,5-7]{1})|(17[0-8]{1})|(18[\d]{1})|(19[0-3,5-9]{1})|(14[0,1,4-9]{1}))+\d{8})$/
    if (value && !regexp.test(value.trim())) {
      reject(new Error("请输入正确的手机号码"))
    }
    resolve()
  })
}

/**
 * 校验密码
 * @param rule
 * @param value
 * @param callback
 */
export function checkPassword(rule: any, value: string) {
  return new Promise<void>((resolve, reject) => {
    const regex = /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,20}$/
    if (value && !regex.test(value)) {
      reject(new Error("密码限制大于8到20位，字母/数字/符号至少有2种"))
    }
    resolve()
  })
}
