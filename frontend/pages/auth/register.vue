<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const { site } = await useSiteInfo()

const {
  user,
  password,
  invitedBy,
  isChecked,
  isLoading,
  userError,
  passwordError,
  invitedByError,
  isReady,
  validateForm,
  loginWithGoogle,
} = useRegister()

// --- Meta ---
definePageMeta({
  public: true,
  layout: 'auth',
  redirectifAuthenticated: true,
})

const canonicalUrl = `https://tetherkade.com${route.path}`
const siteName = t(site.value?.siteName || 'tetherkade') || ''
const metaTitle = computed(() => `${t('registerIn')} ${siteName}`)
const metaDescription = computed(() => `ثبت نام در صرافی ${siteName} و استفاده از امکانات آن`)

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  description: metaDescription,
  ogDescription: metaDescription,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="w-full">
    <!-- Logo Mobile -->
    <div class="flex w-full justify-center items-center lg:hidden">
      <NuxtLink
        :to="localePath('/')"
        :prefetch="false"
        class="text-center"
        :aria-label="$t('backToHome')"
      >
        <CoreLogo class="w-32 mb-2" />
      </NuxtLink>
    </div>

    <!-- Header -->
    <h1 class="font-semibold text-lg lg:text-2xl">
      {{ $t('registerIn') }}
      <span class="text-blue-400">{{ siteName }}</span>
    </h1>

    <!-- Login Link -->
    <p class="mt-4 lg:mt-8 text-sm lg:text-base">
      {{ $t('ifRegister') }}
      <NuxtLink
        :prefetch="false"
        :to="localePath('/auth/login')"
        class="text-blue-400 hover:text-blue-500 transition-colors"
      >
        {{ $t('loginFrom') }}
      </NuxtLink>
    </p>

    <!-- Registration Form -->
    <form @submit.prevent="validateForm" class="mt-4 lg:mt-8 space-y-4 lg:space-y-8">
      <CoreInputUser v-model="user" :error="userError" autocomplete="username" />

      <CoreInputPassword
        v-model="password"
        :error="passwordError"
        label="password"
        autocomplete="new-password"
      />

      <CoreInputTextfield
        v-model="invitedBy"
        id="invitedBy"
        name="invitedBy"
        type="text"
        label="invitedCode"
        :error="invitedByError"
        autocomplete="off"
      />

      <!-- Terms Checkbox -->
      <div class="flex items-center gap-2">
        <input
          id="rules"
          v-model="isChecked"
          type="checkbox"
          name="rules"
          class="mt-1 rounded w-5 h-5 lg:w-6 lg:h-6 accent-blue-400 cursor-pointer"
        />
        <label for="rules" class="text-xs lg:text-base font-medium cursor-pointer select-none">
          <a
            href="https://tetherkade.com/policies"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-400 hover:text-blue-500 transition-colors"
          >
            {{ $t('termsAndConditions') }}
          </a>
          {{ siteName }} {{ $t('readAndAccept') }}
        </label>
      </div>

      <!-- Submit Button -->
      <CoreBtnDefault type="submit" :is-loading="isLoading" :disabled="isLoading" class="w-full">
        {{ $t('navigation.signUp') }}
      </CoreBtnDefault>
    </form>

    <!-- Google Login -->
    <CoreBtnDefault
      outline
      :disabled="!isReady || isLoading"
      class="w-full mt-6 flex justify-center items-center gap-2"
      @click="loginWithGoogle"
    >
      <BaseIcon name="google" class="w-6 h-6" />
      <span>{{ $t('loginWithGoogle') }}</span>
    </CoreBtnDefault>
  </div>
</template>
