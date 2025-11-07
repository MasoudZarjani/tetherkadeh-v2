<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

defineProps({
  status: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <div
    class="bg-yellow-100 rounded-md lg:rounded-lg p-1 lg:p-2 text-black flex flex-col lg:flex-row justify-between items-center text-xs lg:text-base"
  >
    <div class="flex items-center">
      <div>
        <BaseIcon name="alert" className="w-10" />
      </div>
      <div class="mr-2">
        {{ $t('alert.kycBody') }}
      </div>
    </div>
    <div>
      <CoreBtnDefault
        class="text-xs lg:text-base mt-2 lg:mt-0"
        @click="$router.push('/dashboard/kyc/step1')"
        v-if="user?.stepRequest !== 'PendingStep1' && user?.stepRequest !== 'PendingStep2'"
      >
        {{ $t('kycAlertTitle') }}
      </CoreBtnDefault>
      <div class="text-xs lg:text-base mt-2 lg:mt-0" v-else>{{ $t('underReview') }}...</div>
    </div>
  </div>
</template>
