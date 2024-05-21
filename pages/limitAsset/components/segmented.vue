<template>
  <div class="relative flex rounded-full border border-solid border-[#EDEDED] text-[20px] font-semibold">
    <div
      :style="{
        width: `${items[index]}px`,
        left: `${lefts[index]}px`
      }"
      class="trans absolute top-0 h-full rounded-full bg-[#115EE8]"></div>
    <div
      v-for="(item, i) in options"
      :ref="(el: any) => (items[i] = el ? el.offsetWidth : 0)"
      :key="item.value"
      :class="['relative cursor-pointer px-10 leading-[48px] transition', index === i ? 'text-white' : '']"
      @click="handleChange(item.value)">
      {{ item.label }}
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  options: Array<{
    label: string
    value: any
  }>
  modelValue: any
}
const emit = defineEmits(["update:modelValue", "change"])
const props = withDefaults(defineProps<Props>(), {
  options: () => []
})
const items = reactive<number[]>([])
const index = computed(() => props.options.findIndex((e) => e.value === props.modelValue))
const lefts = computed(() => items.map((_, i, arr) => arr.slice(0, i).reduce((total, v) => total + v, 0)))

const handleChange = (value: any) => {
  emit("change", value)
  emit("update:modelValue", value)
}
</script>
<style scoped>
.trans {
  transition:
    width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
