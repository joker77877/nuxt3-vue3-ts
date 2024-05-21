// 请求响应参数（不包含data）
interface Result {
  code: number
  msg: string
}

// 请求响应参数（包含data）
interface ResultData<T = any> extends Result {
  data: T
}

// 分页响应参数
interface ResPage<T> {
  list: T[]
  pageNo?: number
  pageSize?: number
  total: number
}

// 分页请求参数
interface ReqPage {
  pageNo: number
  pageSize: number
}

// 文件上传模块
declare namespace Upload {
  interface Params {
    multipartFile: File
    type: number
    fHash: string
  }
  interface ResFileUrl {
    fileUrl: string
  }
}

// 登录模块
declare namespace Login {
  interface ReqLoginForm {
    username: string
    password: string
  }
  interface ResLogin {
    access_token: string
  }
  // 获取手机验证码
  interface ReqSendSMS {
    mobile: string
    scene: number
  }
  // 获取手机验证码
  interface ReqValidSMS {
    mobile: string
    scene: number
    code: string
  }
  // 修改密码
  interface ReqChangePWD {
    mobile: string
    password: string
    code: string
  }
  // 绑定手机号
  interface ReqBindPhone {
    mobile: string
  }
  // 登录 -- 账号（手机号） + 密码
  interface ReqByPassword {
    mobile: string
    password: string
  }
  // 登录 -- 手机 + 验证码
  interface ReqByPhone {
    mobile: string
    code: string
  }
  // 微信小程序一键登录
  interface ReqAuthByWeChat {
    phoneCode: string
    loginCode: string
    state: string
  }
  // 绑定手机号
  interface ReqBindPhone {
    code: string
    mobile: string
  }
  interface ResAuthButtons {
    [key: string]: string[]
  }
  // 登录响应
  interface ResultAuthData extends Result {
    data: {
      userId: number
      accessToken: string
      refreshToken: string
      expiresTime: string
      openid: string
    }
  }
  // 创建微信js sdk初始化所需的签名 -- 入参 待确认
  interface ReqCreateSignature {
    url: string
  }
  // 刷新令牌 -- 入参 待确认
  interface ReqRefreshToken {
    refreshToken: string
  }
}

// 注册模块
declare namespace Register {
  interface ReqRegisterByPhone {
    mobile: string
    password: string
    code: string
  }
}

interface AuthState {
  accessToken: string
  refreshToken: string
  userId: number | null
}

declare namespace Table {
  interface Pageable {
    pageNo: number
    pageSize: number
    total: number
  }
  interface StateProps {
    tableData: any[]
    pageable: Pageable
    searchParam: {
      [key: string]: any
    }
    searchInitParam: {
      [key: string]: any
    }
    totalParam: {
      [key: string]: any
    }
    icon?: {
      [key: string]: any
    }
  }
}

declare namespace HandleData {
  type MessageType = "" | "success" | "warning" | "info" | "error"
}

declare namespace Theme {
  type ThemeType = "light" | "inverted" | "dark"
  type GreyOrWeakType = "grey" | "weak"
}

type EnumTypes<T> = T[keyof T]

interface IInputItemType<V> {
  label: string
  value: V
  disabled?: boolean
  color?: string
  hidden?: boolean
  tips?: string
}

interface IOutConstantType<V> {
  KEY_VALUE: any
  VALUE_LABEL: any
  VALUE_COLOR: any
  VALUE_TIPS: any
  SELECT_OPTIONS: IInputItemType<V>[]
  [key: string]: any
}
