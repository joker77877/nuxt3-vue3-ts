<template>
  <MitaFilterPage :total="total">
    <template #banner>
      <NuxtImg preload src="/images/asset-index-banner@2px.png" class="w-full" alt="banner"></NuxtImg>
    </template>
    <template #default="slotProps">
      <DesignerList
        :set-total="setTotal"
        :recommend="slotProps.recommend"
        :sort-field-type="slotProps.sortFieldType"
        :recent-works-num="3"
        :area-ids="slotProps.areaIds"
        :keyword="slotProps.keyword"
        size-class="small"
        :industry-id="slotProps.industryId"></DesignerList>
    </template>
  </MitaFilterPage>
</template>

<script setup lang="ts">
const total = ref(0)
const setTotal = (val: number) => {
  total.value = val
}
</script>
