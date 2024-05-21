<template>
  <!-- 找回密码 -- 获取验证码 -->
  <div v-if="step === ActionStep.SEND_MSG" class="form">
    <PhoneSet ref="phoneSetRef" type="findPassword" text="下一步" @submit="goPasswordHandle"></PhoneSet>
  </div>
  <!-- 找回密码 -- 重置密码 -->
  <div v-if="step === ActionStep.SET_PASSWORD">
    <a-form class="form large-form">
      <a-form-item v-bind="validateInfos.password">
        <a-input-password
          v-autofocus
          v-model:value="formChangePWD.password"
          placeholder="请设置一个新密码，至少8位"
          size="large"></a-input-password>
      </a-form-item>
      <a-form-item v-bind="validateInfos.repeatPwd">
        <a-input-password
          v-model:value="formChangePWD.repeatPwd"
          placeholder="请在重复输入一次密码"
          size="large"></a-input-password>
      </a-form-item>
      <a-button v-debounce="setPasswordHandle" :disabled="disabled" type="primary" class="next-btn mb20">确定</a-button>
    </a-form>
  </div>
  <!-- 找回密码 -- 修改成功 -->
  <div v-else-if="step === ActionStep.SET_SUCCESS">
    <div class="success-wrapper flx-center mb40">
      <icon-success-fulled class="mr-2 text-green"></icon-success-fulled>
      <span>密码修改成功,请登录</span>
    </div>
    <a-button type="primary" class="back-btn" @click="goLoginHandle">返回登录</a-button>
  </div>
</template>
<script setup lang="ts">
interface RuleFormChangePWD {
  password: string
  repeatPwd: string
}

enum ActionStep {
  SEND_MSG,
  SET_PASSWORD,
  SET_SUCCESS
}

const emit = defineEmits(["showLogin"])

const step = ref(ActionStep.SEND_MSG)
const phoneSetRef = ref()

const formSendSMS = reactive<Login.ReqBindPhone>({
  mobile: "",
  code: ""
})

const formChangePWD = reactive<RuleFormChangePWD>({
  password: "",
  repeatPwd: ""
})

const rulesChangePWD = reactive<Record<string, Rule[]>>({
  password: [{ required: true, message: "请输入密码" }, { validator: checkPassword }],
  repeatPwd: [{ validator: checkRepeatPassword }]
})

const { validateInfos } = Form.useForm(formChangePWD, rulesChangePWD)
const disabled = computed(() => Boolean(Object.keys(validateInfos).some((k) => validateInfos[k].validateStatus !== "success")))

function checkRepeatPassword(rule: any, value: string) {
  return new Promise<void>((resolve, reject) => {
    if (value && value !== formChangePWD.password) {
      reject(new Error("两次密码不一致!"))
    } else if (!value) {
      reject(new Error("请输入确认密码"))
    } else {
      resolve()
    }
  })
}

const goPasswordHandle = async (formData: any) => {
  try {
    const params = {
      mobile: formData.mobile.trim(),
      code: formData.code,
      scene: SceneEnum.RESET_PASSWORD
    }
    await validateSMSApi(params)
    formSendSMS.mobile = params.mobile
    formSendSMS.code = params.code
    step.value = ActionStep.SET_PASSWORD
  } catch (err) {
    console.log("校验验证码失败")
  }
}

const setPasswordHandle = async () => {
  try {
    await updatePWDApi({
      mobile: formSendSMS.mobile.trim(),
      password: formChangePWD.password,
      code: formSendSMS.code
    })
    message.success("密码修改成功")
    step.value = ActionStep.SET_SUCCESS
  } catch (err: any) {
    console.log("change password error", err)
  }
}

const goLoginHandle = () => {
  emit("showLogin", "password")
}
</script>

<style lang="scss" scoped>
.next-btn,
.back-btn {
  width: 100%;
  height: 49px;
}
.get-code {
  cursor: pointer;
}
.success-wrapper {
  .el-icon {
    font-size: 40px;
    color: var(--el-color-success);
  }
  span {
    font-size: var(--el-font-size-large);
  }
}
</style>
