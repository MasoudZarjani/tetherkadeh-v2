<script setup lang="ts">
defineProps<{
  modelValue: string
  disabled: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const day = ref(0)
const month = ref(0)
const year = ref(0)
const monthList = ref([
  {
    text: 'فروردین',
    value: 1,
  },
  {
    text: 'اردیبهشت',
    value: 2,
  },
  {
    text: 'خرداد',
    value: 3,
  },
  {
    text: 'تیر',
    value: 4,
  },
  {
    text: 'مرداد',
    value: 5,
  },
  {
    text: 'شهریور',
    value: 6,
  },
  {
    text: 'مهر',
    value: 7,
  },
  {
    text: 'آبان',
    value: 8,
  },
  {
    text: 'آذر',
    value: 9,
  },
  {
    text: 'دی',
    value: 10,
  },
  {
    text: 'بهمن',
    value: 11,
  },
  {
    text: 'اسفند',
    value: 12,
  },
])
const yearsList = computed(() => {
  let years = []
  for (let i = 1403; i >= 1300; i--) {
    years.push(i)
  }
  return years
})
watchEffect(() => {
  if (day.value && month.value && year.value) {
    const birthDay = `${year.value}/${month.value}/${day.value}`
    emit('update:modelValue', birthDay)
  }
})
</script>
<template>
  <div class="flex justify-center items-center w-full h-10 lg:h-12">
    <select
      :disabled="disabled"
      name="days"
      id="days"
      v-model="day"
      class="mx-1 w-1/3 rounded-md lg:rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
    >
      <option selected value="0">{{ $t('day') }}</option>
      <option v-for="i in 31" :key="i" :value="i">{{ i }}</option>
    </select>
    <select
      :disabled="disabled"
      name="days"
      id="days"
      v-model="month"
      class="mx-1 w-1/3 rounded-md lg:rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
    >
      <option selected value="0">{{ $t('month') }}</option>
      <option v-for="item in monthList" :key="item.value" :value="item.value">
        {{ item.text }}
      </option>
    </select>
    <select
      :disabled="disabled"
      name="days"
      id="days"
      v-model="year"
      class="mx-1 w-1/3 rounded-md lg:rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 h-10 lg:h-12 text-xs lg:text-base px-2 lg:px-4"
    >
      <option selected value="0">{{ $t('year') }}</option>
      <option v-for="i in yearsList" :key="i" :value="i">{{ i }}</option>
    </select>
  </div>
</template>
