<script setup lang="ts">
const route = useRoute()
const { site } = await useSiteInfo()

const {
  // state
  user,
  password,
  isLoading,
  isCodeSent,
  isReady,

  // validation
  userError,
  passwordError,

  // actions
  loginLocal,
  completed,
  loginWithGoogle,
} = useLogin()

// --- Meta ---
definePageMeta({
  public: true,
  layout: 'auth',
  redirectIfAuthenticated: true,
})

useHead({
  link: [{ rel: 'canonical', href: 'https://tetherkade.com' + route.path }],
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | ورود به داشبورد کاربری`,
  ogTitle: `صرافی ${site.value?.siteName} | ورود به داشبورد کاربری`,
  description: `صرافی ${site.value?.siteName} | ورود به داشبورد کاربری`,
  ogDescription: `صرافی ${site.value?.siteName} | ورود به داشبورد کاربری`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="w-full">
    <h1 class="block font-semibold text-lg lg:text-2xl">
      <div class="flex justify-center items-center lg:hidden">
        <NuxtLink :to="$localePath('/')" :prefetch="false">
          <CoreLogo class="w-32 mb-2" />
        </NuxtLink>
      </div>
      {{ $t('loginTo') }}<span class="text-blue-400">{{ $t(site?.siteName) }}</span>
    </h1>

    <div class="mt-4 lg:mt-8 text-sm lg:text-base font-semibold">
      {{ $t('signUpIf') }}
      <NuxtLink :to="$localePath('/auth/register')" class="text-blue-400" :prefetch="false">
        {{ $t('signUpHere') }}
      </NuxtLink>
    </div>

    <form @submit.prevent="loginLocal" class="mt-4 lg:mt-8">
      <CoreInputUser v-model="user" :error="userError" />
      <CoreInputPassword
        v-model="password"
        :error="passwordError"
        label="password"
        class="mt-4 lg:mt-8"
      />

      <NuxtLink
        :to="$localePath('/auth/forgot-password')"
        :prefetch="false"
        class="block mt-2 text-xs lg:text-sm text-blue-400 text-left"
      >
        {{ $t('forgotPasswordQuestion') }}
      </NuxtLink>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <CoreInputTOTP
          v-if="isCodeSent"
          @completed="completed"
          :fields="6"
          class="mt-4 lg:mt-8 origin-top-right"
        />
      </transition>

      <CoreBtnDefault type="submit" :isLoading="isLoading" class="w-full mt-6">
        {{ $t('navigation.signIn') }}
      </CoreBtnDefault>
    </form>
    <CoreBtnDefault
      outline
      :disabled="!isReady"
      @click="() => loginWithGoogle()"
      class="w-full mt-6 flex justify-center items-center"
    >
      <BaseIcon name="google" class="w-6 h-6" />
      {{ $t('loginWithGoogle') }}
    </CoreBtnDefault>
  </div>
</template>
