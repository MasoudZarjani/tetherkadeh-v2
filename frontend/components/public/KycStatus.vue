<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { UserRequestAuth, UserStatus } from '~/types/user.types'

const { user } = useAuth()

const items = computed(() => {
  if (
    user.value?.stepRequest === UserRequestAuth.RejectStep1 ||
    user.value?.stepRequest === UserRequestAuth.RejectStep2
  )
    return {
      text: 'reAuthenticate',
      color: 'text-red-500',
      url: '/dashboard/kyc/step1',
    }
  else if (user.value?.stepRequest === UserRequestAuth.None)
    return {
      text: 'notAuthenticated',
      color: 'text-orange-500',
      url: '/dashboard/kyc/step1',
    }
  else if (
    user.value?.stepRequest === UserRequestAuth.PendingStep1 ||
    user.value?.stepRequest === UserRequestAuth.PendingStep2 ||
    user.value?.status === UserStatus.Pending
  )
    return {
      text: 'underReview',
      color: 'text-yellow-500',
      url: '#',
    }
  else if (user.value?.stepRequest === UserRequestAuth.Step1)
    return {
      text: 'completeAuthentication',
      color: 'text-blue-500',
      url: '/dashboard/kyc/step1',
    }
  else if (user.value?.status === UserStatus.Approved || user.value?.status === UserStatus.Trusted)
    return {
      text: 'verified',
      color: 'text-green-500',
      url: '#',
    }
})
</script>
<template>
  <div class="text-gray-500 text-sm">
    <NuxtLink
      :prefetch="false"
      :to="$localePath(items?.url)"
      class="cursor-pointer"
      :class="items?.color"
      v-if="items?.text"
    >
      {{ $t(items?.text) }} >>
    </NuxtLink>
  </div>
</template>
