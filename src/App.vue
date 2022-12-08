<script setup>
    import { ref } from "vue";

    import Materials from "./pages/Materials.vue";
    import Footer from "./components/common/Footer.vue";
    import Header
        from "./components/common/Header.vue";

    let route = ref('materials');
</script>

<template>

    <Header />

    <main>
        <template v-if="route === 'materials'">

            <Materials />

        </template>
    </main>

    <Footer />

</template>

<style lang="scss">

</style>
