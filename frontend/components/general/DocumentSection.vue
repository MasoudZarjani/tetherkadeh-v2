<script setup lang="ts">
const { site } = await useSiteInfo()

const isShow = ref(false)
const toggleBtn = () => (isShow.value = !isShow.value)
</script>

<template>
  <section class="max-w-6xl mx-auto mb-6 md:mb-12">
    <div class="overflow-y-hidden px-2 md:px-8" :class="!isShow ? 'h-80' : 'h-full'">
      <div class="relative">
        <div
          v-if="!isShow"
          class="absolute inset-x-0 top-0 h-80 bg-linear-to-t from-white via-white/90 to-white/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900/30"
        ></div>
        <div
          class="document-custom mt-4 text-justify md:text-base"
          :class="isShow ? 'h-full' : 'h-96'"
        >
          <main>
            <section>
              <h2>{{ $t('documentPage.section1.title') }} {{ $t(site?.siteName) }}</h2>
              <p>
                {{ $t('documentPage.section1.body1')
                }}<strong>{{ $t(site?.siteName) }}</strong> {{ $t('documentPage.section1.p0') }}
                <strong>{{ $t('documentPage.section1.strong1') }}</strong>
                {{ $t('documentPage.section1.body2') }}
              </p>
              <p>
                ✅ {{ $t('documentPage.section1.p1') }} {{ $t(site?.siteName) }}
                {{ $t('documentPage.section1.p2') }}
              </p>
            </section>

            <section>
              <h2>{{ $t('documentPage.section2.title') }} {{ $t(site?.siteName) }}؟</h2>
              <ol>
                <li>
                  {{ $t('documentPage.section2.li1')
                  }}<strong>{{ $t('documentPage.section2.strong1') }}</strong>
                </li>
                <li>{{ $t('documentPage.section2.li2') }}</li>
                <li>{{ $t('documentPage.section2.li3') }}</li>
                <li>{{ $t('documentPage.section2.li4') }}</li>
                <li>
                  {{ $t('documentPage.section2.li5') }}
                  <strong>TRC-20، ERC-20 و BEP-20</strong>
                </li>
                <li>{{ $t('documentPage.section2.li6') }}{{ $t(site?.siteName) }}</li>
              </ol>
            </section>

            <section>
              <h2>{{ $t('documentPage.section3.title') }}</h2>
              <ol>
                <li>{{ $t('documentPage.section3.li1') }}</li>
                <li>{{ $t('documentPage.section3.li2') }}</li>
                <li>{{ $t('documentPage.section3.li3') }}</li>
                <li>{{ $t('documentPage.section3.li4') }}</li>
              </ol>
            </section>

            <section>
              <h2>{{ $t('documentPage.section4.title') }} {{ $t(site?.siteName) }}</h2>
              <p>
                {{ $t('documentPage.section4.p1') }} <strong>{{ $t(site?.siteName) }}</strong>
                {{ $t('documentPage.section4.p2') }}:
              </p>
              <ol>
                <li>{{ $t('documentPage.section4.li1') }} {{ $t(site?.siteName) }}</li>
                <li>{{ $t('documentPage.section4.li2') }}</li>
                <li>{{ $t('documentPage.section4.li3') }}</li>
                <li>{{ $t('documentPage.section4.li4') }}</li>
              </ol>
            </section>

            <section>
              <h2>{{ $t('documentPage.section5.title') }} {{ $t(site?.siteName) }}</h2>
              <h3>
                {{ $t('documentPage.section5.q1') }} {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.q11') }}
              </h3>
              <p>
                {{ $t('documentPage.section5.a1') }}
                {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.a11') }}
              </p>

              <h3>
                {{ $t('documentPage.section5.q2') }}
                {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.q22') }}
              </h3>
              <p>
                {{ $t('documentPage.section5.a2') }} <strong>TRC-20 ({{ $t('tron') }})</strong>
                {{ $t('documentPage.section5.a22') }} {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.a222') }}
              </p>

              <h3>
                {{ $t('documentPage.section5.q3') }}
                {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.q33') }}
              </h3>
              <p>
                {{ $t('documentPage.section5.a3') }}
              </p>

              <h3>
                {{ $t('documentPage.section5.q4') }}
                {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.q44') }}
              </h3>
              <p>
                {{ $t('documentPage.section5.a4') }}
                {{ $t(site?.siteName) }}
                {{ $t('documentPage.section5.a44') }}
              </p>
            </section>

            <section>
              <h2>{{ $t('documentPage.section6.title') }}</h2>
              <p>
                <strong>{{ $t(site?.siteName) }}</strong
                >{{ $t('documentPage.section6.p1') }}<strong>{{ $t('tether') }} (USDT)</strong>
                {{ $t('documentPage.section6.p2')
                }}<strong>{{ $t('documentPage.section6.strong1') }}</strong
                >، <strong>{{ $t('documentPage.section6.strong2') }}</strong
                >{{ $t('documentPage.section6.p3') }}
                <strong>{{ $t('documentPage.section6.strong3') }}</strong>
                {{ $t('documentPage.section6.p4') }} {{ $t(site?.siteName) }}
                {{ $t('documentPage.section6.p5') }}
              </p>
            </section>
          </main>
        </div>
      </div>
    </div>
    <button
      class="text-button-small focus-visible:border-focus focus-visible:border-br-focus disabled:text-txt-disabled disabled:border-br-disabled relative mx-auto mt-12 flex h-6 min-w-16 items-center justify-center gap-x-8 rounded-md bg-transparent px-2 text-nowrap text-blue-400 transition duration-150 focus:outline-none focus-visible:outline-none disabled:bg-transparent"
      @click="toggleBtn"
    >
      <div
        v-if="isShow"
        class="flex h-10 w-10 animate-bounce items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 p-2 shadow-lg ring-1 ring-slate-900/5"
      >
        <svg
          class="h-6 w-6 rotate-180 text-blue-400"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
      <div
        v-else
        class="flex h-10 w-10 animate-bounce items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 p-2 shadow-lg ring-1 ring-slate-900/5"
      >
        <svg
          class="h-6 w-6 text-blue-400"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </button>
  </section>
</template>
