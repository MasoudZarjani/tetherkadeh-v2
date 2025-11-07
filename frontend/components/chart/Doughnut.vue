<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart, ArcElement } from 'chart.js'

const { t } = useI18n()
const props = defineProps({
  labels: Array,
  data: Array,
  colors: Array,
})

const labels = toRef(props, 'labels')
const data = toRef(props, 'data')
const colors = toRef(props, 'colors')

Chart.register(ArcElement)
const chartData = ref({
  labels: labels.value,
  datasets: [
    {
      label: data.value > 0 ? t('inventory') : '',
      data: data.value > 0 ? data.value : '100%',
      backgroundColor: colors.value,
      borderColor: colors.value,
      borderWidth: 0,
    },
  ],
})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  cutout: 85,
  hoverOffset: 10,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      rtl: true,
      titleFont: {
        family: 'Vazirmatn',
      },
      bodyFont: {
        family: 'Vazirmatn',
      },
    },
  },
})
</script>

<template>
  <ClientOnly>
    <Doughnut :data="chartData" :options="chartOptions" :height="100" />
  </ClientOnly>
</template>
