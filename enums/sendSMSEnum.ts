/**
 * @description：获取手机验证码
 */
export enum SceneEnum {
  LOGIN = 1, // 会员用户 - 手机号登陆
  UPDATE_MOBILE = 2, // 会员用户 - 修改手机
  UPDATE_PASSWORD = 3, // 会员用户 - 修改密码
  RESET_PASSWORD = 4, // 会员用户 - 忘记密码
  REGISTER = 5, // 会员用户 - 手机号手机注册
  MEMBER_LOGIN = 21, // 后台用户 - 手机号登录
  REAL_NAME_AUTH = 6 // 后台用户 - 手机号登录
}
