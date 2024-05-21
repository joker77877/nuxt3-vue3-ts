<template>
  <a-config-provider
    :theme="{
      token: {
        // padding: 0,
        // paddingSM: 0
      },
      components: {
        Select: {
          fontSizeLG: 14
        },
        Input: {
          colorText: '#999999',
          colorBgContainer: '#F9F9F9',
          borderRadius: 9999
        },
        Tag: {
          borderRadiusSM: 9999,
          colorBorder: '#EBEBED',
          colorFillAlter: 'rgba(0, 0, 0, 0)'
        }
      }
    }">
    <div class="wrapper flex-width-min-to-max">
      <div class="banner-wrap">
        <slot name="banner"></slot>
      </div>
      <div class="relative flex gap-7 px-12">
        <div class="pb-12">
          <a-affix :offset-top="0">
            <div class="mb-5 flex w-[240px] flex-col gap-2 pt-5">
              <a-button v-bind="activeBtn.get(!recommend)" block @click="recommend = false">全部</a-button>
              <a-button v-bind="activeBtn.get(recommend)" block @click="recommend = true">
                {{ recommendBtnText }}
              </a-button>
            </div>
            <div class="filter-wrapper">
              <div class="border-b border-t border-solid py-5">
                <a-collapse :class="initClass" ghost :bordered="false" v-model:activeKey="activeKeys" expand-icon-position="end">
                  <a-collapse-panel class="rounded-none" key="1">
                    <template #header>
                      <div class="gap-2 flex-items-center">
                        <icon-brush class="text-[#606266]"></icon-brush>
                        <span>行业领域</span>
                      </div>
                    </template>
                    <a-radio-group
                      class="mt-3 flex flex-col gap-1"
                      v-model:value="industryId"
                      :options="industry"></a-radio-group>
                  </a-collapse-panel>
                </a-collapse>
              </div>

              <div class="mt25">
                <div class="mb18 flx-align-center gap-2">
                  <icon-address class="address-icon"></icon-address>
                  <span>地点</span>
                </div>
                <a-cascader
                  v-model:value="areaIds"
                  allow-clear
                  show-checked-strategy="SHOW_CHILD"
                  :options="cityOptions"
                  :field-names="cityProps"
                  @change="cityChangedHandle"
                  class="w-full"
                  placeholder="请选择城市"></a-cascader>
              </div>
            </div>
          </a-affix>
        </div>
        <div class="flex-1 pb-12 pl-7 mita-border-l">
          <a-affix :offset-top="0">
            <div class="bg-white">
              <div class="flex items-center justify-between pb-5 pt-7">
                <span>{{ total }}个结果</span>
                <div class="flx-align-center">
                  <div class="mr-5">
                    <a-input
                      v-model:value="keywordInput"
                      placeholder="请输入关键字搜索"
                      @keyup.enter="changeKeywordHandle"
                      @clear="changeKeywordHandle"
                      @blur="changeKeywordHandle"
                      class="w-[330px]"
                      :clearable="true">
                      <template #prefix>
                        <icon-search class="cursor-pointer text-[#606266]" v-debounce="changeKeywordHandle"></icon-search>
                      </template>
                    </a-input>
                  </div>
                  <!-- 排序 -->
                  <a-select v-model:value="sortFieldType" :options="sortOptions" class="filter-select w-[152px]"></a-select>
                </div>
              </div>
              <div class="filter-wrapper flx-align-center pb-5" v-if="recommend || industryId || areaName">
                <a-tag v-if="recommend" closable class="flex p-2" @close="recommend = false">
                  <div class="flex-items-center">
                    <icon-tag class="mr-1 text-[#606266]"></icon-tag>
                    <span>{{ recommendBtnText }}</span>
                  </div>
                </a-tag>
                <a-tag v-if="industryId" closable @close="industryId = 0" class="flex p-2">
                  <div class="flx-align-center">
                    <icon-brush class="mr-1 text-[#606266]"></icon-brush>
                    <span>{{ industryName }}</span>
                  </div>
                </a-tag>
                <a-tag v-if="areaNameFilter" closable @close="clearFilterCityHandle" class="flex p-2">
                  <div class="flx-align-center">
                    <icon-location class="base-icon mr6"></icon-location>
                    <span>{{ areaNameFilter }}</span>
                  </div>
                </a-tag>
              </div>
            </div>
          </a-affix>
          <slot
            :recommend="recommend"
            :sort-field-type="sortFieldType"
            :recent-works-num="3"
            :area-ids="areaIds"
            :keyword="keyword"
            :industry-id="industryId"></slot>
        </div>
      </div>
      <ToTop></ToTop>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ recommendBtnText?: string; total: number }>(), {
  recommendBtnText: "Meta推荐设计师"
})

const { total, recommendBtnText } = toRefs(props)
const { cityOptions, cityProps } = await useCity()
const { industry } = await useIndustry()
const activeBtn = new Map<
  boolean,
  {
    type: ButtonType
    ghost: boolean
  }
>([
  [
    true,
    {
      type: "primary",
      ghost: true
    }
  ],
  [
    false,
    {
      type: "default",
      ghost: false
    }
  ]
])
const initClass = ref("init-active")
const recommend = ref(false)
const activeKeys = ref(["1"])
const industryId = ref(0)
const industryName = computed(() => industry.value.find((e) => e.value === industryId.value)?.label)
const areaIds = ref<number[]>([])
const areaName = ref("")
const areaNameFilter = computed(() => (areaIds.value?.length ? areaName.value : ""))
const keyword = ref<string>()
const keywordInput = ref<string>()

// 其他一些过滤条件
const sortFieldType = ref(0)
const sortOptions = ref(DESIGNER_FILTER_OTHER_ENUM.SELECT_OPTIONS)

const cityChangedHandle = (_v: any, o: any) => {
  areaName.value = o.slice(-1)?.[0].name
}

const clearFilterCityHandle = () => {
  areaIds.value = []
  areaName.value = ""
}
const changeKeywordHandle = () => {
  keyword.value = keywordInput.value
}

onMounted(() => {
  setTimeout(() => {
    initClass.value = ""
  })
})
</script>
<style lang="scss" scoped>
.banner {
  width: 100%;
}
.wrapper {
  .init-active {
    :deep(.ant-collapse-content-active) {
      transition: none !important;
    }
  }
  :deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 0;
    padding-block: 0;
  }
  :deep(.ant-collapse-header) {
    padding: 0;
  }
  .filter-select {
    :deep(.ant-select-selector) {
      border-radius: 9999px;
    }
  }
  .left {
    width: 240px;
    .address-icon {
      width: 16px !important;
      height: 16px !important;
    }
  }
}
.industry-wrapper {
  max-height: 220px;
  overflow: hidden;
  &:hover {
    overflow: auto;
  }
}
</style>
