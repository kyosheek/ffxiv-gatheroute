<script setup>
    import { onBeforeMount, ref } from "vue";

    import { inject } from '@vercel/analytics';

    import Header from "./components/common/Header.vue";
    import Footer from "./components/common/Footer.vue";

    import Materials from "./pages/Materials.vue";

    const componentsNamesMap = {
        'materials': Materials
    };

    let currentComponentName = ref('materials');

    const setComponentName = (componentName) => currentComponentName.value = componentName;

    onBeforeMount(() => inject());
</script>

<template>

    <Header @set-component-name="setComponentName" />

    <main>
        <component :is="componentsNamesMap[currentComponentName]" />
    </main>

    <Footer />

</template>

<style lang="scss">

</style>
