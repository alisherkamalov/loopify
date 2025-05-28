<script setup lang="ts">
import { ref } from 'vue'

import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'

const sheet = ref(false)
</script>

<template>
    <client-only>
        <button type="button" @click="sheet = true">Open bottom sheet</button>
        <BottomSheet v-model="sheet"> Your content </BottomSheet>
    </client-only>

</template>