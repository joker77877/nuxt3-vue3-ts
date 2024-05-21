<template>
  <a-config-provider
    :theme="{
      components: {
        Tabs: {
          // fontSize: 18,
          colorText: '#999999',
          colorPrimary: '#232833'
        }
      }
    }">
    <a-tabs v-model:activeKey="activeKey" class="login-tabs pr-8">
      <a-tab-pane tab="微信登录" key="weixin" class="flex-col-center" :lazy="true">
        <!-- 微信登录 -->
        <!-- <LoginByWechat></LoginByWechat> -->
        <img class="code mt30" src="/images/QRCode.png" alt="" />
        <div class="tips mt20 mb20">
          <p>使用微信扫一扫登录</p>
          <p>“Meta 3D”</p>
        </div>
        <p class="agreement-tips">
          登录即代表您已同意
          <UserAgreement></UserAgreement>
        </p>
      </a-tab-pane>
      <a-tab-pane tab="短信登录" key="sms" :lazy="true">
        <!-- 短信登录 -->
        <PhoneSet type="phoneLogin" class="form pt18" text="登录/注册" @submit="loginBySMSHandle"></PhoneSet>
      </a-tab-pane>
      <a-tab-pane tab="密码登录" key="password" :lazy="true">
        <!-- 密码登录 -->
        <a-form class="form large-form" :model="loginForm" :rules="rules" ref="formRef">
          <a-form-item v-bind="validateInfos.mobile">
            <a-input v-autofocus v-model:value="loginForm.mobile" class="pt18" placeholder="手机号" size="large"></a-input>
          </a-form-item>
          <a-form-item v-bind="validateInfos.password">
            <a-input-password
              v-model:value="loginForm.password"
              placeholder="密码"
              size="large"
              @keyup.enter="triggerLogin"></a-input-password>
          </a-form-item>
          <a-form-item class="agreement-tips flx-align-center">
            <label for="myCheckbox" class="flx-align-center agreement-tips">
              登录即代表您已同意
              <a-link class="mr5 ml5" href="/user/agreement" :underline="false" type="primary">用户协议</a-link>
              和
              <a-link class="mr5 ml5" href="/user/agreement" :underline="false" type="primary">隐私政策</a-link>
            </label>
          </a-form-item>
          <a-button v-debounce="loginByPWDHandle" class="login-btn mb20" type="primary" :disable="disabled">登录</a-button>
        </a-form>
        <div class="flx-justify-between text-sm">
          <span class="cursor-pointer mita-text-grey-nd" @click="forgetPasswordHandle">忘记密码?</span>
          <span class="cursor-pointer text-blue" @click="goRegisterHandle">立即注册</span>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-config-provider>
</template>
<script setup lang="ts">
const { checkUserInfo } = useCheckUserInfo()

interface RuleForm {
  mobile: string
  password: string
}

const authStore = useAuthStore()

const emit = defineEmits(["closePopup", "forgetPassword", "showRegister"])
const { tabname } = defineProps({
  tabname: String
})
const activeKey = ref(tabname || "weixin")

const loginForm = reactive<RuleForm>({
  mobile: "",
  password: ""
})

const rules = reactive<Record<string, Rule[]>>({
  mobile: [{ required: true, message: "请输入手机号" }, { validator: checkPhoneNumber }],
  password: [{ required: true, message: "请输入密码" }, { validator: checkPassword }]
})
const { validate, validateInfos } = Form.useForm(loginForm, rules)
const disabled = computed(() => Boolean(Object.keys(validateInfos).some((k) => validateInfos[k].validateStatus !== "success")))

const loginCallbackHandle = async (data: any) => {
  authStore.saveAuth(data)
  const userInfo = await checkUserInfo()
  if (userInfo) {
    authStore.updateUserInfo(userInfo)
  } else {
    authStore.clearUserInfo()
  }
  emit("closePopup", true)
  if (!(userInfo?.nickname && userInfo?.userRole)) {
    window.open("/user/set-info", "_self")
  } else {
    message.success("登录成功")
    nextTick(() => {
      window.location.reload()
    })
  }
}

// 手机号 + 验证码登录
const loginBySMSHandle = async (params: Login.ReqByPhone) => {
  try {
    const data = await loginBySMSApi({
      mobile: params.mobile,
      code: params.code
    })
    loginCallbackHandle(data)
  } catch (err: any) {
    console.log("login by sms error", err)
  }
}

// 手机号 + 密码登录
const loginByPWDHandle = async () => {
  try {
    const data = await loginByPWDApi({
      mobile: loginForm.mobile.trim(),
      password: loginForm.password
    })
    loginCallbackHandle(data)
  } catch (err: any) {
    console.log("login by password error", err)
  }
}

// 手机号+密码登录 回车触发登录
const triggerLogin = async () => {
  const isValid = await validate()
  if (isValid && loginForm.mobile && loginForm.password) {
    loginByPWDHandle()
  }
}

const forgetPasswordHandle = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  emit("forgetPassword")
}

const goRegisterHandle = () => {
  emit("showRegister")
}
</script>

<style lang="scss" scoped>
.login-tabs {
  .code {
    width: 220px;
    height: 220px;
  }
  .tips {
    font-weight: 500;
    line-height: 22px;
    color: var(--a-text-color-regular);
    text-align: center;
  }
  :deep(.a-tabs__item) {
    height: auto;
    margin-bottom: 33px;
    font-size: var(--a-font-size-large);
    font-weight: 500;
    line-height: 22px;
    color: var(--a-color-info);
    text-align: center;
  }
  :deep(.ant-tabs-tab) {
    padding: 0 0 32px;
    font-size: 18px;
  }
  :deep(.ant-tabs-nav-list) {
    flex: 1;
    justify-content: space-between;
  }
  .login-btn {
    width: 100%;
    height: 49px;
  }
}
</style>
