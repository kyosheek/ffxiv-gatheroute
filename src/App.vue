<script setup>
    import { ref } from "vue";

    import { tsvParse } from "d3-dsv";

    import MaterialsTable from "./components/materials/MaterialsTable.vue";
    import GatherMap from "./components/ui/GatherMap.vue";

    let materials = ref([]);
    const toGather = ref({});

    let err = null;
    let isLoading = ref(true);

    fetch('assets/data/materials.tsv')
        .then(response => response.text())
        .then(text => tsvParse(text))
        .then(data =>
        {
            materials.value = [...data];
        })
        .catch(err =>
        {
            err = JSON.stringify(err, null, 2);
        })
        .finally(() =>
        {
            isLoading.value = false;
        });
</script>

<template>

    <template v-if="err">
        <p>{{ JSON.stringify(err, null, 2) }}</p>
    </template>

    <section class="materials-wrap"
             :class="{ 'is-loading': isLoading }">

        <MaterialsTable :materials="materials"
                        :to-gather="toGather" />

        <GatherMap :materials="materials"
                   :to-gather="toGather" />

    </section>

</template>

<style lang="scss">

</style>
