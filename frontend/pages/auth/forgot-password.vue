<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const { site } = await useSiteInfo()

const {
  user,
  password,
  confirmPassword,
  userError,
  passwordError,
  confirmPasswordError,
  isLoading,
  isCodeSent,
  isPasswordReset,
  sendCode,
  verifyCode,
  changePassword,
  sendAgain,
} = useForgotPassword()

// Meta
definePageMeta({
  public: true,
  layout: 'auth',
  redirectifAuthenticated: true,
})

// SEO
const pageTitle = computed(
  () => `صرافی ${t(site.value?.siteName || 'tetherkade')} | فراموشی رمز عبور`
)

useHead({
  link: [{ rel: 'canonical', href: `https://tetherkade.com${route.path}` }],
})

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageTitle,
  ogDescription: pageTitle,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

// Current step computed
const currentStep = computed(() => {
  if (isPasswordReset.value) return 3
  if (isCodeSent.value) return 2
  return 1
})
</script>

<template>
  <div class="w-full">
    <!-- Header -->
    <header>
      <h1 class="font-extrabold text-3xl">
        {{ $t('forgotPassword') }}
      </h1>

      <p class="mt-8">
        {{ $t('forLogin') }}
        <NuxtLink
          :to="localePath('/auth/login')"
          class="text-blue-400 hover:text-blue-500 transition-colors"
        >
          {{ $t('clickHere') }}
        </NuxtLink>
      </p>
    </header>

    <!-- Step 1: Send Code -->
    <form v-if="currentStep === 1" @submit.prevent="sendCode" class="mt-8 space-y-6">
      <CoreInputUser
        v-model="user"
        :error="userError"
        :disabled="isLoading"
        autocomplete="username"
      />

      <CoreBtnDefault :is-loading="isLoading" type="submit" class="w-full">
        {{ $t('sendCode') }}
      </CoreBtnDefault>
    </form>

    <!-- Step 2: Verify Code -->
    <div v-if="currentStep === 2" class="mt-8">
      <CoreInputSMS
        :is-loading="isLoading"
        class="mt-4 lg:mt-8"
        @send-again="sendAgain"
        @completed="verifyCode"
      />
    </div>

    <!-- Step 3: Reset Password -->
    <form v-if="currentStep === 3" @submit.prevent="changePassword" class="mt-8 space-y-6">
      <CoreInputPassword
        v-model="password"
        label="password"
        :error="passwordError"
        :disabled="isLoading"
        autocomplete="new-password"
      />

      <CoreInputPassword
        v-model="confirmPassword"
        label="confirmPassword"
        :error="confirmPasswordError"
        :disabled="isLoading"
        autocomplete="new-password"
      />

      <CoreBtnDefault :is-loading="isLoading" type="submit" class="w-full">
        {{ $t('edit') }}
      </CoreBtnDefault>
    </form>
  </div>
</template>
