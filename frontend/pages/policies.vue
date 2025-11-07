<script setup lang="ts">
const route = useRoute()
const { site } = await useSiteInfo()

definePageMeta({
  public: true,
})

useSeoMeta({
  title: `صرافی ${site.value?.siteName} | قوانین و مقررات`,
  ogTitle: `صرافی ${site.value?.siteName} | قوانین و مقررات`,
  description: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogDescription: `${site.value?.siteName} | صرافی امن و سریع خرید و فروش تتر و ارز دیجیتال با پشتیبانی ۲۴ ساعته، احراز هویت سریع و کارمزد رقابتی. شروع مطمئن معاملات رمزارز با ${site.value?.siteName}.`,
  ogImage: 'https://tetherkade.com/logo.png',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://tetherkade.com' + route.path }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `قوانین و مقررات ${site.value?.siteName}`,
        url: 'https://tetherkade.com/policies',
        description: `این صفحه شامل قوانین و مقررات استفاده از خدمات ${site.value?.siteName} است.`,
        mainEntity: {
          '@type': 'TermsOfService',
          name: `قوانین و مقررات ${site.value?.siteName}`,
          url: 'https://tetherkade.com/policies',
        },
      }),
    },
  ],
})
</script>
<template>
  <!-- Hero Section -->
  <section class="hero-pattern py-12 sm:py-16 print-hidden">
    <div class="container mx-auto px-4 text-center">
      <div class="fade-in">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {{ $t('navigation.policies') }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
          {{ $t('policyPage.p1') }} {{ $t(site?.siteName) }} {{ $t('policyPage.p2') }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 card-shadow">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('lastUpdate') }}:</span>
            <span class="font-semibold text-gray-800 dark:text-white">1 تیر 1404</span>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 card-shadow">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('version') }}:</span>
            <span class="font-semibold text-gray-800 dark:text-white">1.0</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Main Content -->
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Table of Contents -->
        <div class="lg:col-span-1 print-hidden">
          <div class="sticky-toc bg-white dark:bg-gray-800 rounded-xl card-shadow p-6">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
              {{ $t('policyPage.contents') }}
            </h3>
            <nav class="space-y-2">
              <a
                href="#section-1"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >1. {{ $t('policyPage.general') }}</a
              >
              <a
                href="#section-2"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >2. {{ $t('policyPage.kyc') }}</a
              >
              <a
                href="#section-3"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >3. {{ $t('policyPage.security') }}</a
              >
              <a
                href="#section-4"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >4. {{ $t('policyPage.transactions') }}</a
              >
              <a
                href="#section-5"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >5. {{ $t('policyPage.wages') }}</a
              >
              <a
                href="#section-6"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >6. {{ $t('policyPage.responsibilities') }}</a
              >
              <a
                href="#section-7"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >7. {{ $t('policyPage.privacy') }}</a
              >
              <a
                href="#section-8"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >8. {{ $t('policyPage.cancel') }}</a
              >
              <a
                href="#section-9"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >8. {{ $t('policyPage.change') }}</a
              >
              <a
                href="#section-10"
                class="toc-link block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-lg"
                >10. {{ $t('policyPage.contactUs') }}</a
              >
            </nav>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow p-6 sm:p-8 space-y-12">
            <!-- Section 1: General Terms -->
            <section id="section-1" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                1. {{ $t('policyPage.general') }}
              </h2>

              <div class="info-box p-4 rounded-lg mb-6">
                <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">📋</h4>
                <p class="text-blue-700 dark:text-blue-300">
                  {{ $t('policyPage.section1.p1') }} {{ $t(site?.siteName) }}
                  {{ $t('policyPage.section1.p2') }}
                </p>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">1.1 تعاریف</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mr-4">
                  <li>
                    <span class="highlight">{{ $t('exchange') }}</span
                    >: {{ $t('company') }} {{ $t(site?.siteName) }}
                  </li>
                  <li>
                    <span class="highlight">{{ $t('policyPage.section1.pli11') }}</span
                    >: {{ $t('policyPage.section1.li2') }}
                  </li>
                  <li>
                    <span class="highlight">پلتفرم</span>: وب‌سایت، اپلیکیشن موبایل و سایر سرویس‌های
                    صرافی
                  </li>
                  <li>
                    <span class="highlight">تتر (USDT)</span>: ارز دیجیتال مبتنی بر بلاک چین که توسط
                    صرافی پشتیبانی می‌شود
                  </li>
                </ul>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  1.2 شرایط پذیرش
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  برای استفاده از خدمات صرافی، کاربر باید حداقل ۱۸ سال سن داشته باشد و تبعه کشور
                  ایران باشد. همچنین باید دارای اهلیت قانونی کامل برای انعقاد قراردادهای مالی باشد.
                </p>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  1.3 محدودیت‌های استفاده
                </h3>
                <div class="warning-box p-4 rounded-lg">
                  <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ هشدار</h4>
                  <ul class="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>استفاده از خدمات برای فعالیت‌های غیرقانونی ممنوع است</li>
                    <li>پولشویی و تأمین مالی تروریسم اکیداً ممنوع است</li>
                    <li>ایجاد چندین حساب کاربری توسط یک شخص مجاز نیست</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 2: KYC -->
            <section id="section-2" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                2. {{ $t('policyPage.kyc') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  2.1 الزام احراز هویت
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  طبق قوانین جمهوری اسلامی ایران و مقررات بانک مرکزی، تمام کاربران موظف به تکمیل
                  فرآیند احراز هویت (KYC) هستند.
                </p>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  2.2 مدارک مورد نیاز
                </h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">اشخاص حقیقی:</h4>
                    <ul
                      class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <li>کارت ملی (تصویر واضح)</li>
                      <li>عکس سلفی با کارت ملی</li>
                      <li>مشخصات حساب بانکی</li>
                      <li>شماره تلفن همراه</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">اشخاص حقوقی:</h4>
                    <ul
                      class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <li>اساسنامه شرکت</li>
                      <li>آگهی تأسیس</li>
                      <li>کارت ملی مدیرعامل</li>
                      <li>مجوزهای فعالیت</li>
                    </ul>
                  </div>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  2.3 سطوح احراز هویت
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr class="bg-gray-100 dark:bg-gray-700">
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          سطح
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          حد مجاز روزانه
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          حد مجاز ماهانه
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          سطح 1 (پایه)
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1,000 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          10,000 دلار
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          سطح 2 (متوسط)
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          10,000 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          100,000 دلار
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          سطح 3 (بالا)
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          100,000 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1,000,000 دلار
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- Section 3: Security -->
            <section id="section-3" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                3. {{ $t('policyPage.security') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  3.1 مسئولیت کاربر
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  کاربر مسئول حفظ امنیت اطلاعات ورود خود شامل نام کاربری، رمز عبور و کد تأیید دو
                  مرحله‌ای است.
                </p>

                <div class="success-box p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">
                    ✅ توصیه‌های امنیتی
                  </h4>
                  <ul class="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                    <li>از رمز عبور قوی و منحصر به فرد استفاده کنید</li>
                    <li>تأیید دو مرحله‌ای (2FA) را فعال کنید</li>
                    <li>هرگز اطلاعات ورود خود را با دیگران به اشتراک نگذارید</li>
                    <li>از شبکه‌های Wi-Fi عمومی برای ورود به حساب استفاده نکنید</li>
                  </ul>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  3.2 اقدامات امنیتی صرافی
                </h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">🔐 رمزنگاری</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      تمام اطلاعات با استفاده از رمزنگاری AES-256 محافظت می‌شوند
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">🛡️ فایروال</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      سیستم‌های پیشرفته فایروال برای محافظت از حملات سایبری
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">📊 نظارت 24/7</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      نظارت مستمر بر فعالیت‌های مشکوک و غیرعادی
                    </p>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">
                      💾 پشتیبان‌گیری
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      پشتیبان‌گیری منظم از اطلاعات در مراکز داده مختلف
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Section 4: Transactions -->
            <section id="section-4" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                4. {{ $t('policyPage.transactions') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  4.1 انواع تراکنش
                </h3>
                <div class="grid sm:grid-cols-3 gap-4">
                  <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="text-2xl mb-2">💰</div>
                    <h4 class="font-semibold text-gray-800 dark:text-white">خرید تتر</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">خرید USDT با تومان</p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="text-2xl mb-2">💸</div>
                    <h4 class="font-semibold text-gray-800 dark:text-white">فروش تتر</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      فروش USDT و دریافت تومان
                    </p>
                  </div>
                  <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="text-2xl mb-2">🔄</div>
                    <h4 class="font-semibold text-gray-800 dark:text-white">انتقال</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      انتقال به کیف پول خارجی
                    </p>
                  </div>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  4.2 حداقل و حداکثر مبالغ
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr class="bg-gray-100 dark:bg-gray-700">
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          نوع تراکنش
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          حداقل مبلغ
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          حداکثر مبلغ
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          زمان پردازش
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          خرید تتر
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          10 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          بر اساس سطح KYC
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1-5 دقیقه
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          فروش تتر
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          10 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          بر اساس سطح KYC
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1-5 دقیقه
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          انتقال خارجی
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          20 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          10,000 دلار
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1-72 ساعت
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  4.3 تأیید تراکنش‌ها
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  تمام تراکنش‌ها نیاز به تأیید از طریق ایمیل و پیامک دارند. تراکنش‌های بالای 1,000
                  دلار نیاز به تأیید دستی توسط تیم امنیت دارند.
                </p>
              </div>
            </section>

            <!-- Section 5: Fees -->
            <section id="section-5" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                5. {{ $t('policyPage.wages') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  5.1 جدول کارمزدها
                </h3>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                      <tr class="bg-gray-100 dark:bg-gray-700">
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          خدمت
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          کارمزد
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          حداقل
                        </th>
                        <th
                          class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right"
                        >
                          حداکثر
                        </th>
                      </tr>
                    </thead>
                    <tbody class="text-gray-600 dark:text-gray-300">
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          خرید تتر
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">0</td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          900,000 تومان
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1000,000,000 تومان
                        </td>
                      </tr>
                      <tr>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          فروش تتر
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">0</td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          900,000 تومان
                        </td>
                        <td class="border border-gray-300 dark:border-gray-600 px-4 py-2">
                          1000,000,000 تومان
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="warning-box p-4 rounded-lg">
                  <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    💡 نکات مهم
                  </h4>
                  <ul class="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>کارمزدها ممکن است بر اساس حجم معاملات تغییر کنند</li>
                    <li>کاربران VIP از تخفیف‌های ویژه بهره‌مند می‌شوند</li>
                    <li>هزینه‌های شبکه بلاک چین جداگانه محاسبه می‌شود</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 6: Responsibilities -->
            <section id="section-6" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                6. {{ $t('policyPage.responsibilities') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  6.1 مسئولیت صرافی
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  صرافی {{ $t(site?.siteName) }} متعهد به ارائه خدمات با کیفیت و امن است، اما
                  مسئولیت آن در موارد زیر محدود می‌شود:
                </p>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mr-4">
                  <li>نوسانات قیمت ارزهای دیجیتال</li>
                  <li>مشکلات فنی شبکه بلاک چین</li>
                  <li>قطعی اینترنت یا برق</li>
                  <li>تغییرات قوانین دولتی</li>
                </ul>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  6.2 مسئولیت کاربر
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>صحت اطلاعات ارائه شده</li>
                    <li>رعایت قوانین کشور</li>
                    <li>حفظ امنیت حساب کاربری</li>
                    <li>اطلاع‌رسانی تغییرات مشخصات</li>
                    <li>پرداخت کارمزدها و مالیات‌ها</li>
                  </ul>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  6.3 محدودیت مسئولیت
                </h3>
                <div class="warning-box p-4 rounded-lg">
                  <p class="text-yellow-700 dark:text-yellow-300">
                    حداکثر مسئولیت صرافی در قبال هر کاربر معادل کل مبلغ موجودی حساب کاربری است.
                    صرافی هیچ مسئولیتی در قبال سود از دست رفته یا خسارات غیرمستقیم ندارد.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 7: Privacy -->
            <section id="section-7" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                7. {{ $t('policyPage.privacy') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  7.1 جمع‌آوری اطلاعات
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  صرافی اطلاعات شخصی کاربران را تنها برای اهداف زیر جمع‌آوری و پردازش می‌کند:
                </p>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">اهداف اصلی:</h4>
                    <ul
                      class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <li>احراز هویت کاربران</li>
                      <li>ارائه خدمات مالی</li>
                      <li>رعایت قوانین AML</li>
                      <li>پیشگیری از تقلب</li>
                    </ul>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-2">اهداف فرعی:</h4>
                    <ul
                      class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <li>بهبود خدمات</li>
                      <li>پشتیبانی کاربران</li>
                      <li>ارسال اطلاعیه‌ها</li>
                      <li>تحلیل آماری</li>
                    </ul>
                  </div>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  7.2 حفاظت از اطلاعات
                </h3>
                <div class="success-box p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">
                    🔒 تدابیر امنیتی
                  </h4>
                  <ul class="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                    <li>رمزنگاری پیشرفته داده‌ها</li>
                    <li>دسترسی محدود کارکنان</li>
                    <li>نظارت مستمر بر امنیت</li>
                    <li>پشتیبان‌گیری امن</li>
                  </ul>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  7.3 حقوق کاربران
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  کاربران حق دارند اطلاعات شخصی خود را مشاهده، تصحیح یا حذف کنند. همچنین می‌توانند
                  از پردازش اطلاعات خود انصراف دهند.
                </p>
              </div>
            </section>

            <!-- Section 8: Cancellation -->
            <section id="section-8" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                8. {{ $t('policyPage.cancel') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">8.1 شرایط لغو</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  تراکنش‌های تأیید شده قابل لغو نیستند. اما در موارد خاص زیر امکان بررسی درخواست لغو
                  وجود دارد:
                </p>
                <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mr-4">
                  <li>خطای فنی سیستم</li>
                  <li>تراکنش غیرمجاز</li>
                  <li>مشکل در پردازش</li>
                </ul>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  8.2 فرآیند بازگشت وجه
                </h3>
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <ol class="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>ارسال درخواست از طریق پشتیبانی</li>
                    <li>بررسی توسط تیم فنی (2-5 روز کاری)</li>
                    <li>تأیید یا رد درخواست</li>
                    <li>بازگشت وجه (در صورت تأیید)</li>
                  </ol>
                </div>

                <div class="warning-box p-4 rounded-lg">
                  <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ توجه</h4>
                  <p class="text-yellow-700 dark:text-yellow-300">
                    بازگشت وجه ممکن است تا 10 روز کاری طول بکشد و مشمول کسر کارمزد باشد.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 9: Changes -->
            <section id="section-9" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                9. {{ $t('policyPage.change') }}
              </h2>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">9.1 حق تغییر</h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  صرافی {{ $t(site?.siteName) }} حق تغییر این قوانین و مقررات را در هر زمان محفوظ
                  می‌دارد. تغییرات مهم حداقل 30 روز قبل از اجرا اطلاع‌رسانی می‌شود.
                </p>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  9.2 اطلاع‌رسانی
                </h3>
                <div class="info-box p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    📢 روش‌های اطلاع‌رسانی
                  </h4>
                  <ul class="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                    <li>ایمیل به تمام کاربران</li>
                    <li>اطلاعیه در وب‌سایت</li>
                    <li>پیامک برای تغییرات مهم</li>
                    <li>اعلان در پنل کاربری</li>
                  </ul>
                </div>

                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mt-6">
                  9.3 پذیرش تغییرات
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  ادامه استفاده از خدمات پس از اعلام تغییرات به منزله پذیرش قوانین جدید تلقی می‌شود.
                </p>
              </div>
            </section>

            <!-- Section 10: Contact -->
            <section id="section-10" class="scroll-mt-24">
              <h2
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-2 border-b-2"
                style="border-color: #155dfc"
              >
                10. {{ $t('policyPage.contactUs') }}
              </h2>

              <div class="space-y-4">
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  برای هرگونه سوال یا ابهام در مورد این قوانین و مقررات، می‌توانید از طریق راه‌های
                  زیر با ما تماس بگیرید:
                </p>

                <div class="grid sm:grid-cols-2 gap-6">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-3">اطلاعات تماس</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <span>📞</span>
                        <span class="text-gray-600 dark:text-gray-300">{{ site?.mobile }}</span>
                      </div>
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <span>✉️</span>
                        <span class="text-gray-600 dark:text-gray-300">{{ site?.email }}</span>
                      </div>
                      <div class="flex items-center space-x-2 space-x-reverse">
                        <span>📍</span>
                        <span class="text-gray-600 dark:text-gray-300">{{ site?.address }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-semibold text-gray-800 dark:text-white mb-3">ساعات پاسخگویی</h4>
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>شنبه تا پنج‌شنبه: 08:00 تا 20:00</div>
                      <div>جمعه: 10:00 تا 18:00</div>
                      <div>پشتیبانی آنلاین: 24/7</div>
                    </div>
                  </div>
                </div>
                <div class="success-box p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">
                    ✅ تأیید مطالعه
                  </h4>
                  <p class="text-green-700 dark:text-green-300">
                    با استفاده از خدمات صرافی {{ $t(site?.siteName) }}، شما تأیید می‌کنید که این
                    قوانین و مقررات را به طور کامل مطالعه کرده و با آن موافق هستید.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
