<script setup>
    import { ref } from "vue";

    import Materials from "./pages/Materials.vue";

    let route = ref('materials');
</script>

<template>

    <template v-if="route === 'materials'">

        <Materials />

    </template>

</template>

<style lang="scss">

</style>
