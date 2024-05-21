<template>
  <!-- checkbox -->
  <el-checkbox
    v-if="item.type === 'checkbox'"
    :class="item.className"
    v-model="item.value"
    :label="item.title"
    @change="checkboxChangeHandle($event, item)"
    size="large"></el-checkbox>

  <!-- slider -->
  <template v-if="item.type === 'slider'">
    <div v-show="!item.hide">
      <div class="title" v-if="item.title">{{ item.title }}</div>
      <div class="slider-val flx-justify-between" :class="item.className">
        <el-slider
          v-model="item.value"
          :min="item.min || 0"
          :max="item.max || 1"
          :step="item.step || 0.1"
          :show-input="true"
          :disabled="item.disabled"
          @input="changeHandle($event, item)"
          :show-input-controls="false"></el-slider>
      </div>
    </div>
  </template>

  <!-- color -->
  <el-color-picker
    v-if="item.type === 'color'"
    :class="item.className"
    v-model="item.value"
    :disabled="item.disable"
    @change="changeHandle($event, item)"
    show-alpha></el-color-picker>

  <!-- big-color -->
  <ClientOnly>
    <Sketch v-if="item.type === 'big-color'" :class="item.className" v-model="item.value"></Sketch>
  </ClientOnly>

  <!-- link -->
  <div v-if="item.type === 'link'" class="title" :class="item.className">
    {{ item.title }}
    <span class="cursor-pointer" v-if="item.text" @click="linkHandle(item.linkTarget)">
      {{ typeof item.text === "string" ? item.text : item.text() }}
    </span>
  </div>

  <!-- select-list -->
  <el-card v-if="item.type === 'select-list'" class="w-full" :class="item.className">
    <div
      v-for="option in item.options"
      :key="option.id"
      class="item mb10 flx-align-center"
      :class="[option.id === item.selectedOptionId ? 'active' : '', item.disabled ? 'cursor-not-allowed' : '']"
      @click="chooseCardHandle(option, item)">
      <img style="width: 50px; height: 50px" class="mr10" :src="option.thumbnailUrl" :alt="option.name" />
      <span>{{ option.name }}</span>
    </div>
  </el-card>

  <!-- select-img -->
  <SelectImg v-if="item.type === 'select-img'" :info="item" @change="chooseCardHandle($event, item)"></SelectImg>

  <!-- collapse -->
  <el-collapse v-if="item.type === 'collapse'" :class="[item.className]" v-model="item.activeCollapse">
    <el-collapse-item :key="item.key" :name="item.key">
      <template #title v-if="!Object.keys(item).includes('enable')">
        <span class="mr6">{{ item.title }}</span>
        <el-tooltip effect="dark" v-if="item.tips" :content="item.tips" placement="bottom">
          <icon-help-stroke style="width: 24px; height: 24px"></icon-help-stroke>
        </el-tooltip>
      </template>
      <template #title v-else>
        <div class="flx-justify-between w-full">
          <div class="flx-align-center">
            <span class="mr6">{{ item.title }}</span>
            <el-tooltip effect="dark" v-if="item.tips" :content="item.tips" placement="bottom">
              <icon-help-stroke style="width: 24px; height: 24px"></icon-help-stroke>
            </el-tooltip>
          </div>
          <div @click.stop="">
            <el-switch v-model="item.enable" @change="changeHandle($event, item)" :disabled="item.disabled"></el-switch>
          </div>
        </div>
      </template>
      <div class="setting-wrapper" :class="[item.enable || !Object.keys(item).includes('enable') ? '' : 'gray-filter']">
        <template v-for="paneChild in item.children" :key="paneChild.key">
          <ConfigItem
            :config-item="paneChild"
            :engine="engine"
            :find-node="props.findNode"
            @change="emit('change')"
            @make-link="configChanged"></ConfigItem>
        </template>
      </div>
    </el-collapse-item>
  </el-collapse>

  <!-- tab -->
  <el-tabs
    v-if="item.type === 'tab'"
    :class="item.className"
    :type="item.tabType"
    v-model="item.activeTab"
    :stretch="true"
    @tab-change="changeTabHandle($event, item)">
    <el-tab-pane v-for="childPane in item.children" :key="childPane.key" :label="childPane.title" :name="childPane.key">
      <template v-if="childPane.icon" #label>
        <el-tooltip effect="dark" :content="childPane.tips" placement="bottom">
          <div>
            <component style="pointer-events: none" :is="childPane.icon"></component>
          </div>
        </el-tooltip>
      </template>
      <div class="bg-[#2c364c]" :class="childPane.className">
        <template v-for="childItem in childPane.children" :key="childItem.key">
          <ConfigItem
            :config-item="childItem"
            :engine="engine"
            :find-node="props.findNode"
            @change="emit('change')"
            @make-link="configChanged"></ConfigItem>
        </template>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { Sketch } from "@ans1998/vue3-color"
import { TabPaneName } from "element-plus"
import { ModelConfigItem, OptionItem } from "../config"

interface Props {
  engine: any
  configItem: ModelConfigItem
  findNode: Function
}
const props = defineProps<Props>()
const emit = defineEmits(["change", "makeLink"])
const item = ref(props.configItem)
const engine = computed(() => props.engine)

const checkboxChangeHandle = (val: any, data: ModelConfigItem) => {
  if (data.changeHandle) {
    if (data.key === "showNearDistance") {
      const node = props.findNode("key", "nearDistance")
      data.changeHandle(engine.value, val, node)
    } else {
      data.changeHandle(engine.value, val)
    }
  }
}

const changeTabHandle = (tabName: TabPaneName, data: ModelConfigItem) => {
  if (data.changeHandle) {
    data.changeHandle(engine.value, tabName, data)
  }
}

const linkHandle = (linkTarget: any) => {
  emit("makeLink", linkTarget)
}

const configChanged = (linkTarget: any) => {
  emit("makeLink", linkTarget)
  // TODO 如果右面link类型增加，则需要动态处理了，这里默认是切换最外层的tab
  if (Object.getOwnPropertyDescriptor(linkTarget, "key") && item.value.key === linkTarget.key) {
    item.value.activeTab = linkTarget.value
  }
}

const chooseCardHandle = (option: OptionItem, data: ModelConfigItem) => {
  if (data.disabled) return
  if (Object.getOwnPropertyDescriptor(data, "selectedOptionId")) {
    data.selectedOptionId = option.id
  } else if (data.category === "environment.id") {
    const bgEnvTargetNode = props.findNode("key", "currentEnvironment")
    bgEnvTargetNode.text = option.name
  }
  emit("change")
  if (data.changeHandle) {
    data.changeHandle(engine.value, option.id)
  }
}
const changeHandle = (val: any, data: ModelConfigItem) => {
  if (!engine.value) return
  emit("change")
  if (data.changeHandle) {
    data.changeHandle(engine.value, val, data)
  }
}
</script>
<style lang="scss" scoped>
.select-img-item {
  position: relative;
  img {
    display: block;
    width: 100%;
  }
  .title {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 260px;
    font-size: 12px;
    font-weight: 400;
    line-height: 22px;
    color: #ffffff;
    background-color: rgb(0 0 0 / 35%);
    border-radius: 0 5px;
  }
}
.title {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  color: #ffffff;
}
.card-img-list {
  .el-card {
    background: none;
    border: none;
    .el-card__body {
      padding: 0 !important;
      .item {
        padding: 4px 20px;
        cursor: pointer;
        background: #313e5a;
        img {
          width: 48px;
          height: 40px;
          border-radius: 4px;
        }
        span {
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          color: rgb(255 255 255 / 50%);
        }
        &.active {
          background: #435170;
          span {
            color: #ffffff;
          }
        }
      }
    }
  }
}
.sketch-color {
  width: calc(100% - 20px) !important;
  padding: 10px !important;
  background: #2c364c !important;
}
.gray-filter {
  filter: grayscale(100%);
  .title,
  .subTitle,
  .selected-box .more-btn,
  .selected-box span {
    color: #999999;
  }
  .selected-box .more-btn {
    border-color: #999999;
  }
}
:global(.child-tabs) {
  .el-tabs__header {
    margin: 0 !important;
  }
}
</style>
<style>
.card-img-list .el-card__body {
  padding: 15px 0 !important;
}
</style>
