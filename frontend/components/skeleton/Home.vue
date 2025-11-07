<template>
  <div class="container mx-auto h-full px-4 lg:px-8 py-2 lg:py-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div
        role="status"
        class="border border-slate-50 dark:border-slate-900 rounded-lg p-4"
        v-for="_ in 2"
      >
        <div
          class="animate-pulse w-full bg-slate-50 dark:bg-slate-800 h-48 rounded-lg mb-5 flex justify-center items-center"
        ></div>
        <div class="w-full flex justify-between items-start animate-pulse">
          <div class="block">
            <h3 class="h-3 bg-slate-50 dark:bg-slate-800 rounded-full w-48 mb-4"></h3>
            <p class="h-2 bg-slate-50 dark:bg-slate-800 rounded-full w-32 mb-2.5"></p>
          </div>
          <span class="h-2 bg-slate-50 dark:bg-slate-800 rounded-full w-16"></span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
      <div
        role="status"
        class="border border-slate-50 dark:border-slate-900 rounded-lg p-4"
        v-for="_ in 3"
      >
        <div
          class="animate-pulse w-full bg-slate-50 dark:bg-slate-800 h-48 rounded-lg mb-5 flex justify-center items-center"
        ></div>
        <div class="w-full flex justify-between items-start animate-pulse">
          <div class="block">
            <h3 class="h-3 bg-slate-50 dark:bg-slate-800 rounded-full w-48 mb-4"></h3>
            <p class="h-2 bg-slate-50 dark:bg-slate-800 rounded-full w-32 mb-2.5"></p>
          </div>
          <span class="h-2 bg-slate-50 dark:bg-slate-800 rounded-full w-16"></span>
        </div>
      </div>
    </div>
  </div>
</template>
