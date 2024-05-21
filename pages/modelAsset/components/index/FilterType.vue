<template>
  <div class="product-type-wrap">
    <div class="product-type type-sup">
      <dl class="type-list-wrap">
        <dt class="type-title">作品品类</dt>
        <dd>
          <ul class="type-list pl12">
            <li class="list-item" v-for="item in categoryList" :key="item.id">
              <span class="type-item" :class="{ active: item.active }" @click="handlerCategoryClick(item.id)">
                {{ item.name }}
              </span>
            </li>
          </ul>
        </dd>
      </dl>
    </div>
    <div class="product-type type-sub" v-if="isShowSub">
      <dl class="type-list-wrap">
        <dt class="pt6 type-title">类别</dt>
        <dd>
          <ul class="type-list">
            <li class="list-item" v-for="item in subCategoryList" :key="item.id">
              <span class="type-sub-item" :class="{ active: item.active }" @click="handlerSubCategoryClick(item.id)">
                {{ item.name }}
              </span>
            </li>
          </ul>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProductCategoryVO extends Product.ResProductCategory {
  active: boolean
}
interface FilterTypeProps {
  defaultValue?: FilterTypeInterface
}
const props = withDefaults(defineProps<FilterTypeProps>(), {})
// 子类菜单
const subCategoryList = ref<Array<ProductCategoryVO>>()
// 父类id
const id = ref<number | null>()
// 子类id
const subId = ref<number | null>()
// 是否展示子类别
const isShowSub = computed(() => {
  return subCategoryList.value?.length && subCategoryList.value.length > 1
})

interface FilterEmits {
  (e: "change"): void
}
const emit = defineEmits<FilterEmits>()
// 通知条件改变，需要重新加载数据
const handlerChange = () => {
  emit(`change`)
}

// 暴露给父组件使用
defineExpose({ id, subId })

// 父级菜单
const { data: categoryList } = await useAsyncData(
  "getCategoryOfProduct",
  () =>
    getCategoryOfProduct().then((data) => {
      const list = [{ id: -1, name: "全部", active: true }, ...data.map((item) => ({ active: false, ...item }))]
      // 如果有默认值
      if (props.defaultValue?.categoryIds) {
        const index = list.findIndex((item) => item.id === props.defaultValue?.categoryIds)
        if (index > -1) {
          list.forEach((item) => {
            item.active = false
          })
          list[index].active = true
        }
      }
      return list
    }),
  {
    default: () => []
  }
)

// 加载子菜单
const loadSubCategoryData = async (key: number) => {
  // 如果父菜单点击的是【全部】
  if (key === -1) {
    subCategoryList.value = []
    subId.value = null
    return
  }
  const data = await getSubCategoryOfProduct([key])
  const list = [{ id: -1, name: "全部", active: true }, ...data.map((item: any) => ({ active: false, ...item }))]
  // 如果有默认值,则需要高亮
  if (props.defaultValue?.subCategoryIds) {
    const index = list.findIndex((item) => item.id === props.defaultValue?.subCategoryIds)
    if (index > -1) {
      list.forEach((item) => {
        item.active = false
      })
      list[index].active = true
    }
  }
  subCategoryList.value = list
}

// 点击父级菜单
const handlerCategoryClick = async (cid: number) => {
  id.value = cid
  subId.value = null
  // 父级高亮菜单展示
  categoryList.value?.forEach((item) => {
    if (item.id === cid) {
      item.active = true
    } else {
      item.active = false
    }
  })
  handlerChange()
  // 加载子级
  loadSubCategoryData(cid)
}

// 点击子级菜单
const handlerSubCategoryClick = async (key: number) => {
  subId.value = key
  handlerChange()
  // 高亮菜单展示
  subCategoryList.value?.forEach((item) => {
    if (item.id === key) {
      item.active = true
    } else {
      item.active = false
    }
  })
}
</script>
<style lang="scss" scoped>
.product-type-wrap {
  background-color: #ffffff;
  .product-type {
    border-bottom: 1px solid var(--el-border-color);
    dl.type-list-wrap {
      display: flex;
      padding: 22px 7px 0 50px;
      dt.type-title {
        flex: 0 0 110px;
      }
    }
    .type-list {
      display: flex;
      flex-wrap: wrap;
      li.list-item {
        cursor: pointer;
      }
    }
  }
}
.type-sup {
  font-size: var(--el-font-size-medium);
  li.list-item {
    padding-bottom: 14px;
    margin-right: 43px;
    .type-item {
      position: relative;
      display: flex;
      justify-content: center;
      padding-bottom: 6px;
      &.active {
        color: var(--el-color-primary);
        &::after {
          position: absolute;
          bottom: 0;
          width: 50%;
          height: 2px;
          text-align: center;
          content: "";
          background-color: var(--el-color-primary);
        }
      }
      &:active {
        opacity: 0.8;
      }
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
.type-sub {
  li.list-item {
    padding-bottom: 8px;
    margin-right: 25px !important;
    .type-sub-item {
      display: inline-block;
      padding: 6px 12px;
      &.active,
      &:hover {
        color: var(--el-color-primary);
        background: #f5f5f5;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>
