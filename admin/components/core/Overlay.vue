<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useOverlayStore } from '~/store/overlay';

const { status } = storeToRefs(useOverlayStore());

</script>

<template>
    <v-overlay activator="parent" location-strategy="connected" scroll-strategy="none" v-model="status" v-if="status">

    </v-overlay>
</template>