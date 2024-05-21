<template>
  <div class="upload-form flex-1 rounded-[10px] bg-white pb-[136px] pl-10 pr-[104px] pt-10">
    <a-form layout="vertical" v-bind="{ labelCol: { span: 24 } }">
      <a-form-item label="标题" v-bind="validateInfos.name">
        <a-input :maxlength="60" show-count v-model:value="form.name" placeholder="给藏品取个名字"></a-input>
      </a-form-item>
      <a-form-item label="发行方" v-bind="validateInfos.publisher">
        <a-input :maxlength="100" show-count v-model:value="form.publisher" placeholder="请输入发行方"></a-input>
      </a-form-item>
      <a-form-item label="藏品价格" v-bind="validateInfos.price">
        <a-input v-model:value="form.price" placeholder="请输入价格">
          <template #suffix><span class="rmb">￥</span></template>
        </a-input>
      </a-form-item>
      <a-form-item label="藏品类别" v-bind="validateInfos.categoryId" hide-required-asterisk>
        <a-select
          v-model:value="form.categoryId"
          placeholder="请选择类别"
          :options="categoryList?.map((e) => ({ label: e.name, value: e.id }))"></a-select>
      </a-form-item>
      <a-form-item label="铸造份数" v-bind="validateInfos.stock">
        <a-input v-model:value="form.stock" placeholder="请输入铸造份数"></a-input>
      </a-form-item>
      <a-form-item label="限量藏品描述故事" v-bind="validateInfos.description">
        <Editor v-model:value="form.description"></Editor>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
const form = reactive<LimitedAssetForm>({
  name: "",
  description: "",
  publisher: "",
  price: undefined,
  categoryId: undefined,
  stock: undefined
})
const rules = reactive<Record<string, Rule[]>>({
  name: [{ required: true, message: "请输入标题" }, NOT_ONLY_WHITESPACE],
  description: [
    { required: true, message: "请输入藏品描述" },
    NOT_ONLY_WHITESPACE,
    { max: 2000, message: "内容长度不能超过2000" }
  ],
  categoryId: [{ required: true, message: "请选择藏品类别" }],
  publisher: [{ required: true, message: "请输入发行方" }, NOT_ONLY_WHITESPACE],
  stock: [
    { required: true, message: "请输入铸造份数" },
    INTEGER_REGEX,
    {
      validator: async (_rule: Rule, value: string) => {
        if (Number(value) > 10000) {
          return Promise.reject(new Error("最多只能铸造10000份"))
        }
        return Promise.resolve()
      }
    }
  ],
  price: [{ required: true, message: "请输入价格" }, FLOOT_REGEX]
})
const { validate, validateInfos } = Form.useForm(form, rules)
const { data: categoryList } = useRequest(getProductCategoryList)

/**
 * @description: 设置form表单值
 * @return {*}
 */
const setFormValue = (data: GetWorksDetail.Result) => {
  Object.keys(form).forEach((k) => {
    const key = k as keyof (UploadWorkInfoForm | LimitedAssetForm)

    form[key] = data[key] as never
    if (k === "price" && data[key] === -1) {
      form[k] = undefined
    }
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
  :deep(.ant-select-multiple .ant-select-selection-overflow) {
    gap: 4px 0;
  }
  :deep(.ant-form-item-required) {
    display: flex;
    justify-content: flex-start;
  }
  .rmb {
    @apply text-base font-semibold mita-text-regular;

    font-family: Inter;
  }
}
</style>
