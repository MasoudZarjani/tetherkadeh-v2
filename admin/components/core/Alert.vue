<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAlertStore } from '~/store/alert';

const { status, color, text } = storeToRefs(useAlertStore());

const snackTimeout = 5000;

</script>
<template>
    <v-snackbar v-model="status" :color="color" :timeout="snackTimeout" theme="dark">
        {{ text }}

        <template v-slot:actions>
            <v-btn color="white" @click="status = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>