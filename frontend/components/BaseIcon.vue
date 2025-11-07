<script lang="ts" setup>
const props = defineProps({
  name: { type: String, required: true },
  fill: { type: String, default: 'currentColor' },
  className: { type: String, default: '' },
})

// به صورت داینامیک ایمپورت:
const iconComponent = computed(() => {
  try {
    return defineAsyncComponent(() => import(`~/assets/icons/${props.name}.svg?component`))
  } catch {
    return null
  }
})
</script>

<template>
  <span :class="className" style="line-height: 0">
    <component v-if="iconComponent" :is="iconComponent" :fill="fill" />
    <span v-else>Icon "{{ name }}" not found</span>
  </span>
</template>
