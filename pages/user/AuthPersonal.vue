<template>
  <div class="banner-wrap">
    <NuxtImg class="w-[100%]" src="/images/auth-personal.png"></NuxtImg>
  </div>
  <div class="fixed-width personal-auth mt90 mb100">
    <a-form>
      <div class="border-btm pb30 mb44">
        <div class="title ft20 ftw500 mb50">支付宝扫码实名认证</div>
        <a-form-item class="w444" v-bind="validateInfos.name">
          <div class="item-label">身份证姓名</div>
          <a-input
            v-model:value="form.name"
            type="text"
            :maxlength="60"
            placeholder="请输入您的身份证证件姓名"
            size="large"></a-input>
        </a-form-item>
        <a-form-item class="w444" v-bind="validateInfos.cardId">
          <div class="item-label">身份证号码</div>
          <a-input v-model:value="form.cardId" type="text" placeholder="请输入您的身份证证件号码" size="large"></a-input>
        </a-form-item>
        <a-form-item no-style>
          <div class="item-label">请上传本人身份证证件照</div>
          <div class="flx-align-center gap-[35px]">
            <a-form-item no-style v-bind="validateInfos.cardUrl0">
              <UploadImg
                class="flx-center mr35"
                v-model:image-url="form.cardUrl0"
                width="204px"
                height="153px"
                border-radius="4px"
                :file-size="10"
                :file-type="['image/jpeg', 'image/png']"
                border-style="1px solid #999999"
                :need-delete="false"
                :need-preview="false">
                <template #empty>
                  <div class="pt46 pb45">
                    <NuxtImg class="w-[164px]" src="/images/card-front.png"></NuxtImg>
                    <div class="upload-title">
                      点击上传
                      <span class="color">人像面</span>
                    </div>
                  </div>
                </template>
              </UploadImg>
            </a-form-item>
            <a-form-item no-style v-bind="validateInfos.cardUrl1">
              <UploadImg
                class="flx-center"
                v-model:image-url="form.cardUrl1"
                width="204px"
                height="153px"
                border-radius="4px"
                border-style="1px solid #999999"
                :file-size="10"
                :file-type="['image/jpeg', 'image/png']"
                :need-delete="false"
                :need-preview="false">
                <template #empty>
                  <div class="pt46 pb45">
                    <NuxtImg class="w-[164px]" src="/images/card-back.png"></NuxtImg>
                    <div class="upload-title">
                      点击上传
                      <span class="color">国徽面</span>
                    </div>
                  </div>
                </template>
              </UploadImg>
            </a-form-item>
          </div>
        </a-form-item>
      </div>
      <div class="border-btm pb30 mb30">
        <div class="title ft20 ftw500 mb50">手机验证</div>
        <p class="tips ft16 ftw500 mb45">
          手机号码：{{ phone }}.
          <small>（您可以在个人中心-账号设置-账户安全中更改绑定手机）</small>
        </p>
        <a-form-item v-bind="validateInfos.code">
          <div class="flx-align-center w444">
            <a-input v-model:value="form.code" type="text" placeholder="请输入手机验证码" size="large"></a-input>
            <a-button v-debounce="sendCodeHandle" :disabled="isDisabled" type="primary" class="get-code ml20">
              {{ countdownText }}
            </a-button>
          </div>
        </a-form-item>
      </div>
      <a-form-item>
        <a-button v-debounce="submitForm" type="primary" :disabled="formDisabled" class="submit-btn">完成</a-button>
      </a-form-item>
      <div class="flx-align-center">
        <a-checkbox name="checkedAgreement" v-model:checked="form.checkedAgreement"></a-checkbox>
        <label for="myCheckbox" class="flx-align-center agreement-tips ml10">
          我已同意
          <NuxtLink class="text-blue mr5 ml5" href="/user/serviceAgreement" :underline="false" type="primary">
            《meta 3D网身份认证服务协议》
          </NuxtLink>
        </label>
      </div>
    </a-form>
  </div>
</template>
<script setup lang="ts">
const { countdownText, isDisabled, sendCode } = useCountDown(59)
interface RuleForm {
  name: string
  cardId: string
  code: string
  cardUrl0: string
  cardUrl1: string
  checkedAgreement: boolean
}

const authStore = useAuthStore()
const form = reactive<RuleForm>({
  name: "",
  cardId: "",
  code: "",
  cardUrl0: "",
  cardUrl1: "",
  checkedAgreement: false
})

const rules = reactive<Record<string, Rule[]>>({
  name: [{ required: true, message: "请输入您的身份证证件姓名" }],
  cardId: [{ required: true, message: "请输入您的身份证证件号码" }, { validator: checkIdCard }],
  cardUrl0: [{ required: true, message: "请上传身份证人面像" }],
  cardUrl1: [{ required: true, message: "请上传身份证国徽面" }],
  code: [
    { required: true, message: "请输入手机验证码" },
    { pattern: /^\d{4}$/, message: "请输入4位数字验证码" }
  ]
})
const { validateInfos } = Form.useForm(form, rules)

const phone = computed(() => ellipsisStr(authStore.userInfo?.mobile || "", 6))

const formDisabled = computed(() =>
  Boolean(Object.keys(validateInfos || {}).some((k) => validateInfos[k].validateStatus !== "success"))
)

const sendCodeHandle = async (e: MouseEvent) => {
  e.preventDefault()
  try {
    await sendSMSApi({
      mobile: authStore.userInfo?.mobile || "",
      scene: SceneEnum.REAL_NAME_AUTH
    })
    sendCode()
    ElMessage.success("验证码发送成功")
  } catch (err: any) {
    console.log("发送验证码失败")
  }
}

const submitForm = async () => {
  if (!form.checkedAgreement) {
    ElMessage.error("请勾选meta 3D网身份认证服务协议")
    return
  }
  try {
    const data: any = await userAuthApply({
      userName: form.name || "",
      cardNo: form.cardId || "",
      cardUrl0: form.cardUrl0,
      cardUrl1: form.cardUrl1,
      mobile: authStore.userInfo!.mobile,
      code: form.code
    } as any)
    if (data.status === UserCertificationStatus.PASSING) {
      message.success(data.msg)
      setTimeout(() => {
        navigateTo({
          path: "/user-center/products",
          query: {
            type: ProductListStateEnum.CHECKING
          }
        })
      }, 2000)
    }
  } catch (err: any) {
    console.log("提交实名认证信息失败", err)
  }
}
</script>
<style lang="scss" scoped>
.title {
  line-height: 22px;
  color: var(--el-text-color-regular);
}
.item-label {
  margin-bottom: 17px;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: var(--el-text-color-regular);
}
.tips {
  line-height: 22px;
  color: #666666;
  small {
    font-size: var(--el-font-size-base);
    color: #999999;
  }
}
.w444 {
  width: 444px;
}
.submit-btn {
  width: 362px;
  height: 49px;
}
.get-code {
  height: 38px;
}
.border-btm {
  border-bottom: 1px solid #cccccc;
}
:global(.personal-auth .el-form-item) {
  flex-direction: column;
  margin-bottom: 36px;
}
:global(.personal-auth .el-form-item .el-form-item__label) {
  justify-content: unset;
  height: 22px;
  margin-bottom: 17px;
  font-size: var(--el-font-size-medium);
  font-weight: 500;
  line-height: 22px;
}
.upload-title {
  font-size: var(--el-font-size-base);
  font-weight: 400;
  line-height: 22px;
  color: var(--el-text-color-regular);
  .color {
    color: $primary-color;
  }
}
:global(.personal-auth .el-checkbox) {
  margin-right: 0;
}
</style>
