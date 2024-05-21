<template>
  <div class="banner-wrap">
    <NuxtImg class="w-[100%]" src="/images/auth-company.png"></NuxtImg>
  </div>
  <div class="fixed-width mt90 mb100">
    <el-form :model="form" :rules="rules" label-position="left" label-width="150px" ref="formRef">
      <div class="border-btm pb30 mb44">
        <div class="title ft20 ftw500 mb50">企业信息</div>
        <el-form-item label="上传营业执照" required>
          <UploadImg
            class="flx-center mb34"
            :image-url="businessLicense"
            width="344px"
            height="180px"
            border-radius="4px"
            border-style="1px solid #115EE8"
            :file-size="10"
            :need-delete="false"
            :need-preview="false"
            :api="uploadUserAvatarApi"
            @update:image-url="imgBusinessLicenseChangedHandle">
            <template #empty>
              <div class="pt34 pb22">
                <icon-business-license></icon-business-license>
                <span>点击上传营业执照</span>
              </div>
            </template>
          </UploadImg>
          <div class="item-tips ml54">
            <p>范例：</p>
            <p>1.需为中国大陆工商局或市场监督管理局登记的企业，营业执照需在有效期内；</p>
            <p>2.需提供高清彩色元件或加盖红色公章的黑白复应件（非电子章）；</p>
            <p>3.不可添加与CG模型网认证无关的水印，否则将驳回认证申请；</p>
            <p>4.同一个企业主体认证企业账号数量上限为2个，以营业执照为准，请勿超额提交；</p>
            <p>5.确保照片完成（不缺边角），证件周围不允许加上边角框（如：加上红框等）；</p>
            <p class="tips-red mt28">注意：请上传最新盖公章的营业执照（副本），图片仅支持JPG/PNG格式，大小10M。</p>
          </div>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <div class="flx-align-center">
            <el-input
              v-model="form.companyName"
              style="width: 344px"
              type="text"
              maxlength="60"
              placeholder="请输入企业名称"
              size="large"></el-input>
            <p class="tips ft16 ftw500 ml54">
              请与营业执照的企业保持一致；企业名称与提现支付宝账户的真实姓名保持一致，否则将无法提现。
            </p>
          </div>
        </el-form-item>
        <el-form-item class="w475" label="统一社会信用代码" prop="socialCreditCode">
          <el-input
            v-model="form.socialCreditCode"
            type="text"
            placeholder="请与营业执照的机构名保持一致"
            size="large"></el-input>
        </el-form-item>
      </div>
      <div class="border-btm pb30 mb44">
        <div class="title ft20 ftw500 mb50">运营者信息</div>
        <el-form-item class="w475" label="运营者姓名" prop="operationName">
          <el-input
            v-model="form.operationName"
            type="text"
            maxlength="60"
            placeholder="请输入运营者姓名"
            size="large"></el-input>
        </el-form-item>
        <el-form-item class="w475" label="身份证号码" prop="cardId">
          <el-input v-model="form.cardId" type="text" placeholder="请输入您的身份证号码" size="large"></el-input>
        </el-form-item>
        <el-form-item label="企业认证申请公函" required>
          <UploadImg
            class="flx-center mb34"
            :image-url="officialLetter"
            width="344px"
            height="180px"
            border-radius="4px"
            border-style="1px solid #CCCCCC"
            :file-size="10"
            :need-delete="false"
            :need-preview="false"
            :api="uploadUserAvatarApi"
            @update:image-url="imgOfficialLetterChangedHandle">
            <template #empty>
              <div class="pt46 pb45">
                <icon-upload-file class="mb13"></icon-upload-file>
                <span>点击上传</span>
              </div>
            </template>
          </UploadImg>
          <div class="item-tips ml54">
            <p class="tips-red mb28">图片仅支持JPG/PNG格式，大小10M</p>
            <p>
              请下载官方模版
              <!-- <NuxtLink class="tips-primary" to="">《企业认证申请公函》</NuxtLink> -->
              <span class="tips-primary">《企业认证申请公函》</span>
              ，加盖企业公章、（合同章、财务章无效）扫码或者拍照上传。
              <span class="tips-primary" @click="showDemoHandle">查看示例</span>
            </p>
          </div>
        </el-form-item>
        <el-form-item class="w475" label="公司联系邮箱" prop="email">
          <el-input v-model="form.email" type="text" placeholder="请输入您的公司联系邮箱" size="large"></el-input>
        </el-form-item>
      </div>
      <div class="border-btm pb30 mb30">
        <div class="title ft20 ftw500 mb50">手机验证</div>
        <p class="tips ft16 ftw500 mb45">
          手机号码：{{ phone }}.
          <small>（您可以在个人中心-账号设置-账户安全中更改绑定手机）</small>
        </p>
        <el-form-item label-width="0" prop="code">
          <div class="flx-align-center">
            <el-input v-model="form.code" type="text" placeholder="请输入手机验证码" size="large"></el-input>
            <el-button v-debounce="sendCodeHandle" :disabled="isDisabled" type="primary" class="get-code ml20">
              {{ countdownText }}
            </el-button>
          </div>
        </el-form-item>
      </div>
      <el-form-item label-width="0">
        <!-- :disabled="!asyncFormIsValid" :type="asyncSubmitType" -->
        <el-button v-debounce="submitForm" type="primary" class="submit-btn">提交认证</el-button>
      </el-form-item>
      <el-form-item label-width="0" prop="checkedAgreement" class="flx-align-center agreement-box">
        <el-checkbox name="checkedAgreement" v-model="form.checkedAgreement"></el-checkbox>
        <label for="myCheckbox" class="flx-align-center agreement-tips ml10">
          我已同意
          <el-link class="text-blue mr5 ml5" href="/user/serviceAgreement" :underline="false" type="primary">
            《meta 3D网身份认证服务协议》
          </el-link>
        </label>
      </el-form-item>
    </el-form>
  </div>
  <a-modal v-model:open="openDemoImg" title="" @ok="openDemoImg = false" :footer="null">
    <NuxtImg class="w-[100%]" src="/images/official-letter.png"></NuxtImg>
  </a-modal>
</template>
<script setup lang="ts">
const { countdownText, isDisabled, sendCode } = useCountDown(59)
interface RuleForm {
  companyName: string | null
  socialCreditCode: string | null
  code: string
  email: string
  operationName: string
  cardId: string | null
  checkedAgreement: boolean
}

const authStore = useAuthStore()
const phone = computed(() => ellipsisStr(authStore.userInfo?.mobile || "", 6))
const businessLicense = ref()
const officialLetter = ref()
const openDemoImg = ref(false)

const formRef = ref<FormInstance>()
const form = reactive<RuleForm>({
  companyName: "",
  socialCreditCode: "",
  code: "",
  email: "",
  operationName: "",
  cardId: "",
  checkedAgreement: false
})

const rules = reactive<FormRules<RuleForm>>({
  companyName: [{ required: true, message: "请输入您的身份证证件姓名" }],
  socialCreditCode: [
    { required: true, message: "请与营业执照的机构名保持一致" },
    { min: 18, max: 18, message: "统一社会信用代码输入错误，请验证后重新输入" }
  ],
  email: [{ required: true, message: "请输入您的公司联系邮箱" }, { validator: checkEmail }],
  operationName: [{ required: true, message: "请输入您的身份证证件姓名" }],
  cardId: [{ required: true, message: "请与营业执照的机构名保持一致" }, { validator: checkIdCard }],
  code: [
    { required: true, message: "请输入手机验证码" },
    { pattern: /^\d{4}$/, message: "请输入4位数字验证码" }
  ]
})

const showDemoHandle = () => {
  openDemoImg.value = true
}

const imgBusinessLicenseChangedHandle = (fileUrl: string) => {
  businessLicense.value = fileUrl
}
const imgOfficialLetterChangedHandle = (fileUrl: string) => {
  officialLetter.value = fileUrl
}

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
  console.log("提交表单，下一步")
  try {
    await userAuthApply({
      userName: form.companyName || "",
      cardNo: form.socialCreditCode || "",
      cardUrl0: businessLicense.value,
      chargeName: form.operationName,
      chargeCardNo: form.cardId,
      enterCertifLetterUrl: officialLetter.value,
      enterpriseMail: form.email,
      mobile: authStore.userInfo!.mobile,
      code: form.code
    } as any)
    navigateTo({
      path: "/user-center/products",
      query: {
        type: ProductListStateEnum.CHECKING
      }
    })
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
.w475 {
  width: 475px;
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
.item-tips {
  font-size: var(--el-font-size-base);
  font-weight: 400;
  line-height: 22px;
  color: #666666;
  .tips-red {
    color: #e54850;
  }
  .tips-primary {
    color: $primary-color;
    cursor: pointer;
  }
}
</style>
