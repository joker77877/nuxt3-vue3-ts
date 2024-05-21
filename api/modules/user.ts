/**
 * @name 用户实名认证
 */
export const userAuthApply = (params: User.ReqRealName) => {
  return http.post(`${APP}/member/user/auth/apply`, params)
}

/**
 * @name 查询会员实名认证信息
 */
export const getUserAuth = () => {
  return http.get<User.UserAuthInfo>(`${APP}/member/user/auth/query`)
}

/**
 * @name 获取用户信息
 */
export const getUserInfoApi = () => {
  return http.get<User.UserInfo>(`${APP}/member/user/get`)
}

/**
 * @name 上传用户头像
 */
export const uploadUserAvatarApi = (params: any) => {
  return http.post<UploadOneFile.Result>(`${APP}/infra/file/save/file`, params)
}

/**
 * @name 更新用户信息
 */
export const setUserInfoApi = (params: User.SetBaseInfo) => {
  return http.put<boolean>(`${APP}/member/user/update`, params)
}

/**
 * @name 更新用户兴趣
 */
export const setUserProfessionApi = (params: User.SetProfession) => {
  return http.put<boolean>(`${APP}/member/user/update-tag`, params)
}

/**
 * @name 用户管理模块
 */
export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(`${APP}/user/list`, params)
}

/**
 * @name 用户管理模块
 */
export const getUserInfo = () => {
  return http.get(`${APP}/member/user/get`)
}
/**
 * @name 获取用户所有标签
 */
export const getUserTagList = () => {
  return http.get<User.Tag[]>(`${APP}/member/tag/record/list-all-simple`)
}
