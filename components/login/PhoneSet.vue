<template>
  <a-form class="large-form">
    <a-form-item v-bind="validateInfos.mobile">
      <a-input-group compact>
        <a-select style="width: 80px" v-model:value="selectedAreaCode" disabled size="large" placeholder="Select">
          <a-select-option value="1">+86</a-select-option>
          <a-select-option value="2">+852</a-select-option>
          <a-select-option value="3">+853</a-select-option>
        </a-select>
        <a-input
          style="width: calc(100% - 80px)"
          v-model:value="form.mobile"
          placeholder="请输入手机号"
          v-autofocus
          size="large"
          @input="validatePhoneHandle"></a-input>
      </a-input-group>
    </a-form-item>
    <a-form-item>
      <SliderCheck ref="sliderCheckRef" @status-changed="changeSliderStatus"></SliderCheck>
    </a-form-item>
    <div v-show="isValidated && asyncPhoneIsValid">
      <a-form-item v-bind="validateInfos.code">
        <a-input v-model:value.number="form.code" placeholder="验证码" size="large" @input="validateCodeHandle">
          <template #suffix>
            <a-button v-debounce="sendCodeHandle" :disabled="isDisabled" type="text" class="p-0 h-auto">
              {{ countdownText }}
            </a-button>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="type === PhoneSetTypeEnum.REGISTER" v-bind="validateInfos.password">
        <a-input-password
          v-model:value="form.password"
          @input="validatePWDHandle"
          placeholder="8-20位密码，数字/字母/符号至少2种"
          size="large"></a-input-password>
      </a-form-item>
    </div>
    <a-form-item
      class="flx-align-center agreement-box"
      v-bind="validateInfos.checkedAgreement"
      v-if="type !== PhoneSetTypeEnum.FINDPASSEORD">
      <a-checkbox v-if="type === PhoneSetTypeEnum.REGISTER" class="mr0" v-model:checked="form.checkedAgreement">
        <span class="flx-align-center agreement-tips">
          <span>我已阅读并接受</span>
          <UserAgreement></UserAgreement>
        </span>
      </a-checkbox>
      <span v-else class="flx-align-center agreement-tips">
        <span>登录即代表您已同意</span>
        <UserAgreement></UserAgreement>
      </span>
    </a-form-item>
    <a-form-item>
      <a-button v-debounce="submitForm" :disabled="!asyncFormIsValid" type="primary" class="register-btn">
        {{ text }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
const { countdownText, isDisabled, sendCode } = useCountDown(59)

interface RuleForm extends Register.ReqRegisterByPhone {
  checkedAgreement: boolean
}

const { text, type } = withDefaults(
  defineProps<{
    text: string
    type: PhoneSetEnumKeys
  }>(),
  {
    text: "立即注册",
    type: "register"
  }
)
const emit = defineEmits(["submit", "show-login", "close-popup"])

const form = reactive<RuleForm>({
  mobile: "",
  code: "",
  password: "",
  checkedAgreement: false
})
const rules = reactive<Record<string, Rule[]>>({
  mobile: [{ required: true, message: "请输入手机号" }, { validator: checkPhoneNumber }],
  code: [
    { required: true, message: "请输入验证码" },
    { pattern: /^\d{4}$/, message: "请输入4位数字验证码" }
  ]
})
const { validate, validateInfos } = Form.useForm(form, rules)
const sliderCheckRef = ref()
const selectedAreaCode = ref("1")
const isValidated = ref(false)

const asyncPhoneIsValid = ref(false)
const asyncFormIsValid = ref(false)
const asyncCodeIsValid = ref(false)
const asyncPWDIsValid = ref(false)

const sceneVal = computed(() => {
  switch (type) {
    case PhoneSetTypeEnum.REGISTER:
      return SceneEnum.REGISTER
    case PhoneSetTypeEnum.PHONELOGIN:
      return SceneEnum.LOGIN
    case PhoneSetTypeEnum.SETPHONE:
      return SceneEnum.UPDATE_MOBILE
    case PhoneSetTypeEnum.FINDPASSEORD:
      return SceneEnum.RESET_PASSWORD
    default:
      return SceneEnum.LOGIN
  }
})

const validatePhoneHandle = async () => {
  try {
    await validate("mobile")
    asyncPhoneIsValid.value = true
  } catch (err: any) {
    asyncPhoneIsValid.value = false
  }
}
const updateFormValid = () => {
  const baseInvalid = asyncCodeIsValid.value && asyncPhoneIsValid.value
  asyncFormIsValid.value =
    type === PhoneSetTypeEnum.FINDPASSEORD || type === PhoneSetTypeEnum.PHONELOGIN
      ? baseInvalid
      : asyncPWDIsValid.value && baseInvalid
}

const validateCodeHandle = async () => {
  try {
    await validate("code")
    asyncCodeIsValid.value = true
  } catch (err: any) {
    asyncCodeIsValid.value = false
  }
  updateFormValid()
}

const validatePWDHandle = async () => {
  try {
    await validate("password")
    asyncPWDIsValid.value = true
  } catch (err: any) {
    asyncPWDIsValid.value = false
  }
  updateFormValid()
}

onBeforeMount(() => {
  if (type !== PhoneSetTypeEnum.PHONELOGIN) {
    rules.password = [{ required: true, message: "请输入密码" }, { validator: checkPassword }]
  }
})

const submitForm = () => {
  if (!form.checkedAgreement && type === PhoneSetTypeEnum.REGISTER) {
    message.error("请勾选用户协议和隐私政策")
    return
  }
  form.mobile = form.mobile.trim()
  emit("submit", form)
}

const sendCodeHandle = async (e: MouseEvent) => {
  e.preventDefault()
  try {
    await validate("mobile")
    await sendSMSApi({
      mobile: form.mobile.trim(),
      scene: sceneVal.value
    })
    sendCode()
    message.success("验证码发送成功")
  } catch (err: any) {
    if (err?.mobile) {
      message.error("请输入正确的手机号")
    }
  }
}

const changeSliderStatus = (status: string) => {
  isValidated.value = status === "success"
  validatePhoneHandle()
}
</script>

<style lang="scss" scoped>
.register-btn {
  width: 100%;
  height: 49px;
}
.agreement-box {
  height: 20px;
}
</style>
