<template>
  <div class="banner-wrap">
    <NuxtImg preload src="/images/search-banner.png" class="banner" alt="banner"></NuxtImg>
  </div>
  <div class="search-box mt30 mb40">
    <el-input
      v-model="keyword"
      placeholder="请输入关键字搜索"
      @clear="searchHandle"
      @keyup.enter="searchHandle"
      @change="searchHandle"
      :clearable="true"
      size="large">
      <template #prepend>
        <icon-search class="search-icon" v-debounce="searchHandle"></icon-search>
      </template>
    </el-input>
  </div>
  <div class="tab-btn-group border-btm flx-center mb34">
    <span v-for="tab in SEARCH_ITEMS" :key="tab.id" :class="{ active: tab.id === currentTypeId }" @click="changeTabHandle(tab)">
      {{ tab.name }}
    </span>
  </div>
  <AssetsList v-if="currentTypeId === ProductType.ASSETS" class="mb50"></AssetsList>
  <div v-if="currentTypeId === ProductType.DESIGNER || currentTypeId === ProductType.MAKER">
    <div class="border-btm pb20 mb20">
      <div class="flx-justify-between content-wrapper">
        <div class="left flx-center">
          <!-- 编辑推荐 -->
          <el-select style="width: 90px" placeholder="请选择" class="mr20" v-model="recommend" size="small">
            <el-option
              v-for="(item, index) in filterRecommendOptions"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <!-- 行业领域 -->
          <el-select style="width: 120px" v-model="industryId" class="mr20" value-key="id" placeholder="请选择行业" size="small">
            <el-option v-for="item in industry" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!-- 选择城市 -->
          <el-cascader
            style="width: auto"
            v-model="cityId"
            clearable
            :options="cityOptions"
            :props="cityProps"
            placeholder="请选择城市"
            size="small">
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </div>
        <div style="width: 100px">
          <el-select class="designer-sort" placeholder="请选择" v-model="sortFieldType" size="small">
            <el-option v-for="(item, index) in sortOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="flex-width-min-to-max px-12 total-num mb30">共{{ total }}个结果</div>
    <DesignerList
      v-if="currentTypeId === ProductType.DESIGNER"
      :set-total="setTotal"
      class="flex-width-min-to-max px-12 mb30"
      :recommend="recommend"
      :sort-field-type="sortFieldType"
      :recent-works-num="4"
      :city-id="cityId"
      :keyword="currentKeyword"
      :industry-id="industryId"></DesignerList>
    <BussinessDockList
      v-else
      class="mx-12"
      :set-total="setTotal"
      :recommend="recommend"
      :sort-field-type="sortFieldType"
      :recent-works-num="3"
      :area-ids="cityId"
      :keyword="currentKeyword"
      :industry-id="industryId"></BussinessDockList>
  </div>
  <ToTop></ToTop>
</template>
<script setup lang="ts">
const { cityOptions, cityProps } = await useCity()
const { industry } = await useIndustry()

interface TabItem {
  id: number
  key: string
  name: string
}

const route = useRoute()
const { searchType, searchContent } = route.query
const currentTypeId = ref(SEARCH_ITEMS.find((type) => type.id === Number(searchType))?.id)

const keyword = ref<string>(searchContent as string)
const currentKeyword = ref<string>(searchContent as string)
// 编辑推荐options
const total = ref(0)
const setTotal = (val: number) => {
  total.value = val
}
const recommend = ref(false)
const filterRecommendOptions = ref(FILTER_RECOMMEND_ENUM.SELECT_OPTIONS)
const cityId = ref([])
const industryId = ref(0)
const sortFieldType = ref(0)
const sortOptions = ref(DESIGNER_FILTER_OTHER_ENUM.SELECT_OPTIONS)

watch(route, () => {
  if (route.name !== "search") return
  currentTypeId.value = SEARCH_ITEMS.find((type) => type.id === Number(route.query.searchType))?.id
  keyword.value = route.query.searchContent as string
  currentKeyword.value = keyword.value
})

const searchHandle = () => {
  const query: any = {
    searchType: currentTypeId.value
  }
  query.searchContent = keyword.value
  navigateTo(
    {
      name: "search",
      query
    },
    {
      replace: true
    }
  )
}

const changeTabHandle = (tab: TabItem) => {
  const query: any = {
    searchType: tab.id
  }
  if (keyword.value) {
    query.searchContent = keyword.value
  }
  navigateTo(
    {
      name: "search",
      query
    },
    {
      replace: true
    }
  )
}
</script>
<style lang="scss" scoped>
.banner-wrap {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 260px;
  background-color: #000000;
  .el-image {
    display: inline-block;
    width: auto;
    height: 100%;
  }
}
.border-btm {
  border-bottom: 1px solid #ebebed;
}
.search-box {
  flex-shrink: 0;
  width: 756px;
  height: 48px;
  margin-right: auto;
  margin-left: auto;
}
.tab-btn-group {
  gap: 68px;
  span {
    position: relative;
    padding-bottom: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    color: var(--el-text-color-regular);
    text-align: center;
    cursor: pointer;
    &.active::after {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 84px;
      height: 2px;
      content: "";
      background-color: #232833;
      transform: translateX(-50%);
    }
  }
}
.content-wrapper {
  width: 1410px;
  margin-right: auto;
  margin-left: auto;
}
</style>
<style lang="scss">
.search-box {
  height: 48px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 10px;
  .el-input-group__prepend {
    height: 46px;
    cursor: pointer;
    background: none;
    border: none;
    box-shadow: none;
  }
  .el-input__wrapper,
  .el-input {
    border: none;
    border-radius: 10px;
    box-shadow: none;
  }
}
.search-content {
  .product-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .product-filter dl {
    padding-left: 0 !important;
  }
  .product-filter .other-filters {
    padding-right: 0 !important;
  }
}
</style>
