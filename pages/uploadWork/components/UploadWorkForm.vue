<template>
  <div class="upload-form flex-1 rounded-[10px] bg-white pb-[136px] pl-10 pr-[104px] pt-10">
    <a-form layout="vertical" v-bind="{ labelCol: { span: 24 } }">
      <a-form-item label="标题" v-bind="validateInfos.name">
        <a-input :maxlength="60" show-count v-model:value="form.name" placeholder="给3D作品作品取个名字"></a-input>
      </a-form-item>
      <a-form-item label="作品描述" v-bind="validateInfos.description">
        <!-- <a-textarea
          v-model:value="form.description"
          :maxlength="400"
          show-count
          :rows="7"
          placeholder="描述下3D作品作品"></a-textarea> -->
        <ClientOnly fallback="加载中...">
          <Editor v-model:value="form.description" placeholder="描述下3D作品作品"></Editor>
        </ClientOnly>
      </a-form-item>
      <a-form-item label="作品类别" v-bind="validateInfos.categoryId" hide-required-asterisk>
        <a-select
          v-model:value="form.categoryId"
          placeholder="请选择类别"
          :options="categoryList?.map((e) => ({ label: e.name, value: e.id }))"></a-select>
      </a-form-item>
      <a-form-item v-bind="validateInfos.tags">
        <template #label>
          <div class="flex flex-1 items-center justify-between">
            <span>标签</span>
            <span class="text-sm text-[#999]">还可添加{{ 10 - form.tags.length }}个</span>
          </div>
        </template>
        <a-select :open="false" v-model:value="form.tags" mode="tags" max-count="10" allow-clear placeholder="请输入标签">
          <template #tagRender="{ label, closable, onClose }">
            <a-tag color="#115EE8" :closable="closable" class="" @close="onClose">
              {{ label }}
            </a-tag>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="validateInfos.publishType">
        <template #label>
          <div class="flex flex-1 justify-between">
            <span>选择发布模式</span>
            <div class="flex gap-10">
              <div class="flex items-center">
                <icon-info></icon-info>
                <span class="ml-2 text-sm">查看授权协议</span>
              </div>
              <div class="flex items-center">
                <icon-question></icon-question>
                <span class="ml-2 text-sm">授权区别</span>
              </div>
            </div>
          </div>
        </template>
        <a-radio-group v-model:value="form.publishType" @change="onChangePublishType">
          <a-radio :value="e.value" v-for="e of PUBLISH_TYPE_LIST" :key="e.value" style="font-size: 14px">
            {{ e.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <p class="mita-text-grey" v-if="form.publishType === PublishTypeEnum.Download">作品发布后，免费提供给网站用户下载。</p>
      <p class="mita-text-grey" v-else-if="form.publishType === PublishTypeEnum.Share">
        作品发布后，网站浏览用户只能查看作品，没有下载和购买入口。
      </p>
      <a-row :gutter="12" class="w-full" v-if="form.publishType === PublishTypeEnum.Sell">
        <a-col :span="8">
          <a-form-item v-bind="validateInfos.personalPrice">
            <a-input v-model:value="form.personalPrice" placeholder="请输入个人授权价格">
              <template #suffix><span class="rmb">￥</span></template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item v-bind="validateInfos.enterprisesPrice">
            <a-input v-model:value="form.enterprisesPrice" placeholder="请输入企业授权价格">
              <template #suffix><span class="rmb">￥</span></template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item v-bind="validateInfos.copyrightPrice">
            <a-input v-model:value="form.copyrightPrice" :disabled="isPublishForLimited" placeholder="请输入版权售出价格">
              <template #suffix><span class="rmb">￥</span></template>
            </a-input>
            <span class="danger-color" v-if="isPublishForLimited">该3d资产已经铸造为限量资产，不能出售版权</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script setup lang="ts">
const isPublishForLimited = ref(false)
const form = reactive<UploadWorkInfoForm>({
  name: "",
  description: "",
  categoryId: undefined,
  personalPrice: undefined,
  enterprisesPrice: undefined,
  copyrightPrice: undefined,
  tags: [],
  publishType: undefined
})
const rules = reactive<Record<string, Rule[]>>({
  name: [{ required: true, message: "请输入标题" }, NOT_ONLY_WHITESPACE],
  description: [
    { required: true, message: "请输入作品描述" },
    NOT_ONLY_WHITESPACE,
    { max: 2000, message: "内容长度不能超过2000" }
  ],
  categoryId: [{ required: true, message: "请选择作品类别" }],
  tags: [
    { type: "array", required: true, message: "请选择标签" },
    {
      validator: (rule, value) => {
        return new Promise((resolve) => {
          if (value.length > 10) {
            value.pop()
          }
          resolve()
        })
      }
    }
  ],
  publishType: [{ required: true, message: "请选择发布模式" }],
  personalPrice: [{ message: "请输入个人授权价格" }, FLOOT_REGEX, { validator: priceValidator }],
  enterprisesPrice: [{ message: "请输入企业授权价格" }, FLOOT_REGEX, { validator: priceValidator }],
  copyrightPrice: [{ message: "请输入版权售出价格" }, FLOOT_REGEX, { validator: priceValidator }]
})
const { validate, validateInfos } = Form.useForm(form, rules)
const { data: categoryList } = useRequest(getProductCategoryList)

/**
 * @description: 发布状态变更
 * @return {*}
 */
const onChangePublishType = () => {
  form.personalPrice = undefined
  form.enterprisesPrice = undefined
  form.copyrightPrice = undefined

  validate("personalPrice")
}
/**
 * @description: 校验价格
 * @return {*}
 */
function priceValidator() {
  return new Promise<void>((resolve, reject) => {
    const flag = isPublishForLimited.value
      ? !form.personalPrice && !form.enterprisesPrice
      : !form.personalPrice && !form.enterprisesPrice && !form.copyrightPrice
    const priceOptions = isPublishForLimited.value
      ? UPLOAD_PRICE_FORM_ITEM_LIST.filter((item) => item !== "copyrightPrice")
      : UPLOAD_PRICE_FORM_ITEM_LIST
    if (flag && form.publishType === PublishTypeEnum.Sell) {
      priceOptions.forEach((k) => {
        validateInfos[k].validateStatus = "error"
        validateInfos[k].help = ["必须填写一个价格"]
      })
      if (isPublishForLimited.value) {
        validateInfos.copyrightPrice.validateStatus = "success"
        validateInfos.copyrightPrice.help = ""
        resolve()
      }
      reject(new Error("必须填写一个价格"))
    } else {
      priceOptions.forEach((k) => {
        validateInfos[k].validateStatus = "success"
        validateInfos[k].help = null
      })
      resolve()
    }
  })
}
/**
 * @description: 设置form表单值
 * @return {*}
 */
const setFormValue = (data: GetWorksDetail.Result) => {
  // 是否发过藏品且藏品目前状态处于上架或者审核中
  isPublishForLimited.value =
    (data.spuType === AssetTypeEnum.LIMITED || data.spuType === AssetTypeEnum.BOTH) &&
    (data.status === AssetStatusEnum.CHECKING || data.status === AssetStatusEnum.NORMAL)
  Object.keys(form).forEach((k) => {
    const key = k as keyof UploadWorkInfoForm

    form[key] = data[key] as never
  })
  // validate()
}
defineExpose({
  validate,
  validateInfos,
  form,
  setFormValue
})
</script>
<style lang="postcss" scoped>
.upload-form {
  :deep(.ant-select-multiple .ant-select-selector) {
    padding: 5px 20px;
  }
  :deep(.ant-select-multiple .ant-select-selection-overflow) {
    gap: 4px 0;
  }
  :deep(.ant-form-item-required) {
    display: flex;
    justify-content: flex-start;
  }
  .rmb {
    @apply mita-text-regular text-base font-semibold;

    font-family: Inter;
  }
}
</style>

