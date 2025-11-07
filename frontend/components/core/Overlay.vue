<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useOverlayStore } from '~/stores/overlay'

const { status } = storeToRefs(useOverlayStore())
</script>

<template>
  <div
    class="flex fixed justify-center align-center w-full min-h-full h-auto top-0 left-0 z-50 backdrop-brightness-50"
    v-if="status"
  >
    <client-only>
      <div class="flex flex-col justify-center align-center">
        <NuxtImg loading="lazy" format="webp" src="/logo.png" class="animate-pulse w-32" />
        <span class="mt-4 text-white">{{ $t('pleaseWait') }}</span>
      </div>
    </client-only>
  </div>
</template>
