<template>
  <div class="product-filter">
    <dl>
      <dt>
        <!-- 编辑推荐 -->
        <el-select
          placeholder="请选择"
          v-model="filterValue.recommend"
          @change="handlerChange"
          @focus="closePriceFilter"
          style="width: 90px"
          size="small">
          <el-option
            v-for="(item, index) in filterRecommendOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </dt>
      <dd>
        <!-- 排序 -->
        <el-select
          placeholder="请选择"
          v-model="filterValue.sortFieldType"
          @change="sortChangedHandler"
          @focus="closePriceFilter"
          style="width: 100px"
          size="small">
          <el-option
            v-for="(item, index) in filterSortOptions"
            :key="index"
            :label="item.label"
            :disabled="item.disabled"
            :value="item.value"></el-option>
        </el-select>
      </dd>
      <dd>
        <!-- 价格 -->
        <FilterPrice
          ref="filterPriceRef"
          :default-price="defaultPrice"
          @change="priceChangedHandle"
          @focus="closePriceFilter"></FilterPrice>
      </dd>
      <dd>
        <!-- 格式 -->
        <el-select
          placeholder="请选择"
          v-model="filterValue.format"
          @change="handlerChange"
          @focus="closePriceFilter"
          style="width: 100px"
          size="small">
          <el-option
            v-for="(item, index) in filterFormatOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </dd>
      <dd>
        <!-- 面数 -->
        <el-select
          placeholder="请选择"
          v-model="filterValue.surfaceCount"
          @change="handlerChange"
          @focus="closePriceFilter"
          style="width: 100px"
          size="small">
          <el-option
            v-for="(item, index) in filterSurfaceOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </dd>
    </dl>
    <div class="other-filters">
      <!-- 其他 -->
      <el-checkbox-group v-model="filterValue.other" @change="handlerChange">
        <el-checkbox v-for="(item, index) in filterOtherOptions" :value="item.value" :key="index">
          {{ item.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts" name="FilterCondition">
// 编辑推荐options
const filterRecommendOptions = ref(FILTER_RECOMMEND_ENUM.SELECT_OPTIONS)
// 排序字段options
const filterSortOptions = ref(FILTER_SORT_ENUM.SELECT_OPTIONS)
// 价格排序options
// const sortPriceOptions = ref(SORT_PRICE_ENUM.SELECT_OPTIONS)
// 格式options
const filterFormatOptions = ref(FILTER_FORMAT_ENUM.SELECT_OPTIONS)
// 面options
const filterSurfaceOptions = ref(FILTER_SURFACE_ENUM.SELECT_OPTIONS)
// 其他一些过滤条件
const filterOtherOptions = ref(FILTER_OTHER_ENUM.SELECT_OPTIONS)
// 刷选条件
interface FilterConditionProps {
  defaultCondition: FilterConditionInterface
}
const props = withDefaults(defineProps<FilterConditionProps>(), {})
const filterValue = ref(props.defaultCondition)
const filterPriceRef = ref()
interface FilterEmits {
  (e: "change"): void
}
const emit = defineEmits<FilterEmits>()
// 通知条件变化
const handlerChange = () => {
  emit(`change`)
}
const defaultPrice = ref<FilterPriceInterface>({
  startPrice: null,
  endPrice: null,
  sortAsc: true
})

const sortChangedHandler = () => {
  // 重置价格中的条件
  filterPriceRef.value.resetValue()
  delete filterValue.value.priceType
  filterValue.value.startPrice = null
  filterValue.value.endPrice = null
  filterValue.value.sortAsc = true
  emit(`change`)
}

const closePriceFilter = (e: Event) => {
  filterPriceRef.value.closePriceFilter(e)
}

const priceChangedHandle = (sortPriceFieldType?: number) => {
  const { sortAsc, startPrice, endPrice, type } = filterPriceRef.value.filterPriceValue
  filterValue.value.sortAsc = sortAsc
  filterValue.value.startPrice = startPrice
  filterValue.value.endPrice = endPrice
  filterValue.value.priceType = type
  if (sortPriceFieldType) {
    filterValue.value.sortFieldType = -1
    filterValue.value.sortPriceFieldType = sortPriceFieldType
  }
  emit(`change`)
}

// 暴露给父组件使用
defineExpose({ filterValue: filterValue.value, price: defaultPrice.value })
</script>
<style lang="scss" scoped>
.product-filter {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  background-color: #ffffff;
  dl {
    display: flex;
    align-items: center;
    padding: 22px 7px 0 50px;
    dt {
      width: 100px;
    }
    dd {
      margin: 0 20px;
      &.other-filters {
        float: right;
        cursor: pointer;
      }
    }
  }
  .other-filters {
    display: flex;
    align-items: center;
    padding: 22px 45px 0;
    cursor: pointer;
  }
  .filter-price {
    display: flex;
    gap: 10px;
  }
}
</style>
