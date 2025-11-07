<script setup lang="ts">
const colorMode = useColorMode()
const { t } = useI18n()

const tooltipVisible = ref(false)

const modes = ['light', 'dark']
const currentIndex = ref(modes.indexOf(colorMode.preference))

function toggleMode() {
  currentIndex.value = (currentIndex.value + 1) % modes.length
  colorMode.preference = modes[currentIndex.value]
}

function showTooltip() {
  tooltipVisible.value = true
  setTimeout(() => {
    tooltipVisible.value = false
  }, 1500)
}

function modeLabel() {
  return colorMode.preference === 'dark' ? t('darkMode') : t('lightMode')
}
</script>

<template>
  <div class="relative inline-block">
    <div
      class="relative flex justify-center items-center w-10 h-10 rounded-full cursor-pointer transition-colors duration-300 hover:bg-slate-300 dark:hover:bg-slate-600"
      @click="toggleMode"
      @mouseenter="showTooltip"
      @touchstart="showTooltip"
    >
      <transition name="fade-scale" mode="out-in">
        <!-- آیکن دارک -->
        <svg
          v-if="colorMode.preference === 'dark'"
          key="dark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="20"
          height="20"
          class="fill-slate-800 *:dark:fill-slate-200"
        >
          <path
            d="M6 0C2.5.9 0 4.1 0 7.9 0 12.4 3.6 16 8.1 16c3.8 0 6.9-2.5 7.9-6C9.9 11.7 4.3 6.1 6 0z"
          />
        </svg>

        <!-- آیکن لایت -->
        <svg
          v-else
          key="light"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="20"
          height="20"
          fill="#155dfc"
        >
          <path
            d="M9 14v2H7v-2h2zm3.949-2.395l1.415 1.413-1.414 1.415-1.415-1.414 1.414-1.414zm-9.968-.07l1.414 1.415-1.415 1.413-1.414-1.414 1.415-1.414zM8 4c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm8 3v2h-2V7h2zM2 7v2H0V7h2zm1.05-5.293L4.465 3.12 3.05 4.535 1.636 3.121 3.05 1.707zm9.83-.07l1.414 1.415-1.415 1.413-1.414-1.414 1.415-1.414zM9 0v2H7V0h2z"
          />
        </svg>
      </transition>
    </div>

    <!-- تولتیپ فارسی -->
    <transition name="fade-scale">
      <div
        v-if="tooltipVisible"
        class="absolute left-1/2 -translate-x-1/2 mt-2 text-xs bg-black text-white px-2 py-1 rounded shadow-md z-10 whitespace-nowrap"
      >
        {{ modeLabel() }}
      </div>
    </transition>
  </div>
</template>
