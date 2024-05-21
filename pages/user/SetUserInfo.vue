<template>
  <div class="setUserInfo-wrapper flx-center">
    <div class="content flx-center flx-column">
      <a-form
        class="user-info-form pt50 pb50 px-16"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 21 }"
        label-align="left"
        :colon="false">
        <UploadImg
          class="flx-center mb34"
          v-model:image-url="userAvatar"
          width="120px"
          height="120px"
          border-radius="60px"
          :file-size="10"
          :need-delete="false"
          drag
          :need-preview="false"
          :api="uploadUserAvatarApi"
          @update:image-url="imgChangedHandle"></UploadImg>
        <a-form-item label="属性">
          <a-radio-group v-model:value="form.type">
            <a-radio :value="1">个人</a-radio>
            <a-radio :value="2">企业</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="form.nickname" :maxlength="60" placeholder="给自己取个名字吧～"></a-input>
        </a-form-item>
        <a-form-item label="角色">
          <a-radio-group v-model:value="form.role">
            <a-radio :value="1">购买者或售卖者</a-radio>
            <a-radio :value="2">
              <div class="flex">
                <span>设计师</span>
                <a-tooltip v-if="form.type === 2" class="box-item" title="填写昵称时请输入设计师名称" placement="top">
                  <icon-help class="ml-1"></icon-help>
                </a-tooltip>
              </div>
            </a-radio>
            <a-radio :value="3">
              <div class="flex">
                <span>艺术家</span>
                <a-tooltip v-if="form.type === 2" class="box-item" title="填写昵称时请输入艺术家名称" placement="top">
                  <icon-help class="ml-1"></icon-help>
                </a-tooltip>
              </div>
            </a-radio>
            <a-radio :value="4">制造商</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="行业">
          <a-select
            v-model:value="form.profession"
            :options="professions.map((e) => ({ label: e.name, value: e.id }))"
            placeholder="请选择行业"></a-select>
        </a-form-item>
        <a-form-item label="城市" class="mb34 city-item">
          <a-cascader
            v-model:value="form.city"
            :options="cityOptions"
            :field-names="cityProps"
            placeholder="请选择城市"></a-cascader>
        </a-form-item>
        <a-button :disabled="disabled" class="submit-btn" type="primary" v-debounce="submitForm">下一步</a-button>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
interface RuleForm {
  type: number
  role?: number
  nickname: string
  profession?: number
  city?: number[]
}

const authStore = useAuthStore()

const cityProps = {
  value: "id",
  label: "name"
}
const userAvatar = ref(DEFAULT_AVATAR_IMG)
const professions = ref<System.ResListByType[]>([])
const cityOptions = ref<System.City[]>([])
const form = reactive<RuleForm>({
  type: 1,
  role: undefined,
  nickname: "",
  profession: undefined,
  city: undefined
})

const rules = reactive<FormRules<RuleForm>>({
  type: [{ required: true, message: "请选择属性" }],
  role: [{ required: true, message: "请选择角色" }],
  nickname: [{ required: true, message: "请输入昵称" }],
  profession: [{ required: true, message: "请选择行业" }],
  city: [{ required: true, message: "请选择城市" }]
})

const { validate, validateInfos } = Form.useForm(form, rules)
const disabled = computed(() => Boolean(Object.keys(validateInfos).some((k) => validateInfos[k].validateStatus !== "success")))

const getUserInfoHandle = async () => {
  const data = await getUserInfoApi()

  if (data.avatar) {
    userAvatar.value = data.avatar
  }
  form.type = data.userType
  form.role = data.userRole
  form.nickname = data.nickname
  form.profession = data.industry
  form.city = data.areaIds
  // 内容返显后触发表单校验
  validate()
}

const getProfessionHandle = async () => {
  try {
    const data = await getListByTypeApi({ tagType: ListByTypeEnum.PROFESSION })

    professions.value = data as any
  } catch (err) {
    console.log("获取行业列表失败", err)
  }
}

const getAreaHandle = async () => {
  try {
    const data = await getAreaApi()

    cityOptions.value = (data as any).map((city: System.City) => {
      const children = city.children.map((child: System.City) => ({
        id: child.id,
        name: child.name,
        children: []
      }))
      return {
        ...city,
        children
      }
    })
  } catch (err) {
    console.log("获取地区列表错误", err)
  }
}

const imgChangedHandle = (fileUrl: string) => {
  userAvatar.value = fileUrl
}

onMounted(() => {
  getUserInfoHandle()
  getProfessionHandle()
  getAreaHandle()
})

const submitForm = async () => {
  // 预加载路由会加载用户可能在未来导航到的给定路由的组件。这样确保了组件提前可用，并且不太可能阻塞导航，从而提高性能
  // preloadRouteComponents("@/pages/user/ChoosePreference.vue")
  const params = {
    avatar: userAvatar.value === DEFAULT_AVATAR_IMG ? "" : userAvatar.value, // TODO 添加上传用户头像
    userType: form.type,
    userRole: form.role,
    nickname: form.nickname,
    industry: form.profession,
    areaId: form.city?.at(-1)
  }
  await setUserInfoApi(params)

  await authStore.updateUserInfo()
  $bus.emit("updateUserInfo")
  navigateTo("/user/choose-preference")
}
</script>
<style lang="scss" scoped>
.setUserInfo-wrapper {
  min-height: calc(100vh - 156px);
  background: #f5f5f5;
  .info {
    font-size: var(--a-font-size-extra-large);
    font-weight: 600;
  }
  .content {
    .user-info-form {
      box-sizing: border-box;
      width: 492px;
      background: #ffffff;
      border: 1px solid rgb(174 180 175 / 20%);
      border-radius: 20px;
      box-shadow:
        0 10px 40px -4px rgb(16 24 40 / 8%),
        0 8px 8px -4px rgb(16 24 40 / 2%);
    }
    .submit-btn {
      width: 100%;
      height: 49px;
    }
  }
}
</style>
<style lang="scss">
// .user-info-form {
// }
</style>
<style lang="scss">
.user-info-form {
  .upload-box .upload .a-upload .a-upload-dragger {
    border: none;
  }
}
</style>
