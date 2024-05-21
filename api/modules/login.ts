/**
 * @name 绑定手机号
 */
export const bindPhoneApi = (params: Login.ReqBindPhone) => {
  return http.put(`${APP}/member/user/bind-mobile`, params)
}

/**
 * @name 短信登录  手机号 + 验证码
 */
export const loginBySMSApi = (params: Login.ReqByPhone) => {
  return http.post<User.ResLogin>(`${APP}/member/auth/sms-login`, params)
}

/**
 * @name 账号登录  手机号 + 密码
 */
export const loginByPWDApi = (params: Login.ReqByPassword) => {
  return http.post<User.ResLogin>(`${APP}/member/auth/login`, params)
}

/**
 * @name 获取验证码
 */
export const sendSMSApi = (params: Login.ReqSendSMS) => {
  return http.post<boolean>(`${APP}/member/auth/send-sms-code`, params, { loading: false })
}

/**
 * @name 校验验证码
 */
export const validateSMSApi = (params: Login.ReqValidSMS) => {
  return http.post<boolean>(`${APP}/member/auth/validate-sms-code`, params, { loading: false })
}

/**
 * @name 手机号注册
 */
export const registerByPhoneApi = (params: Register.ReqRegisterByPhone) => {
  return http.put<User.ResLogin>(`${APP}/member/user/register-mobile-user`, params)
}

/**
 * @name 重置密码（忘记密码）
 */
export const updatePWDApi = (params: Login.ReqChangePWD) => {
  return http.put<boolean>(`${APP}/member/user/reset-password`, params, { loading: false })
}

/**
 * @name 获取微信信息
 */
export const getWechatQRApi = () => {
  return http.get(`${APP}/member/auth/create-weixin-jsapi-signature`)
}

/**
 * @name 退出登录
 */
export const logoutApi = () => {
  return http.post<boolean>(`${APP}/member/auth/logout`)
}

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`${APP}/login`, params, { loading: false }) // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: false }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
}
