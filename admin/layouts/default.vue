<template>
  <v-app>
    <v-main class="page-wrapper">
      <CoreAlert />
      <CoreOverlay />
      <AppDrawer />
      <AppHeader />
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
