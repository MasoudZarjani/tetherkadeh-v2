<template>
  <section id="how-it-works" class="py-20 bg-slate-50 dark:bg-slate-800">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {{ $t('howItWork') }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"></p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="relative mb-8">
            <div
              class="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto"
            >
              <span class="text-white font-bold text-2xl">1</span>
            </div>
            <div
              class="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-blue-400 opacity-30"
            ></div>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {{ $t('registrationAndVerification') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ $t('registrationAndVerificationDescription') }}
          </p>
        </div>
        <div class="text-center">
          <div class="relative mb-8">
            <div
              class="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto"
            >
              <span class="text-white font-bold text-2xl">2</span>
            </div>
            <div
              class="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-blue-400 opacity-30"
            ></div>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {{ $t('depositPrice') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ $t('depositPriceDescription') }}
          </p>
        </div>
        <div class="text-center">
          <div class="relative mb-8">
            <div
              class="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center mx-auto"
            >
              <span class="text-white font-bold text-2xl">3</span>
            </div>
            <div
              class="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-blue-400 opacity-30"
            ></div>
          </div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {{ $t('buyOrSell') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ $t('buyOrSellDescription') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
