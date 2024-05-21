export enum PhoneSetTypeEnum {
  REGISTER = "register",
  SETPHONE = "setPhone",
  PHONELOGIN = "phoneLogin",
  FINDPASSEORD = "findPassword"
}
declare global {
  type PhoneSetEnumKeys = keyof typeof PhoneSetTypeEnum | `${PhoneSetTypeEnum}`
}
