<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  symbols: {
    type: Array,
    required: true,
  },
})

const widgetId = `tv-symbol-overview-${Math.random().toString(36).substring(2)}`

onMounted(() => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: props.symbols,
      width: '100%',
      height: '100%',
      chartOnly: false,
      locale: 'en',
      colorTheme: 'dark',
      autosize: true,
      showVolume: true,
      showMA: true,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: 'Arial',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      dateRanges: ['1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
    })

    document.getElementById(widgetId)?.appendChild(script)
  }
})
</script>

<template>
  <div :id="widgetId" class="w-full" />
</template>
