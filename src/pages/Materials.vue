<script setup>
import { ref } from "vue";

import { tsvParse } from "d3-dsv";

import Table from "../components/Table.vue";
import Router from "../components/Router.vue";

let materials = ref([]);
const toGather = ref({});

let err = ref(null);
let isLoading = ref(true);

fetch('assets/data/materials.tsv')
    .then(response => {
        err = null;
        return response.text();
    })
    .then(text => tsvParse(text))
    .then(data =>
    {
        materials.value = data.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
    })
    .catch(err =>
    {
        err.value = JSON.stringify(err, null, 2);
    })
    .finally(() =>
    {
        isLoading.value = false;
    });
</script>

<template>

    <template v-if="err">

        <pre>{{ JSON.stringify(err, null, 2) }}</pre>

    </template>
    <template v-else>

        <section class="materials-wrap"
                 :class="{ 'is-loading': isLoading }">

            <Table :materials="materials"
                   :to-gather="toGather" />

            <Router :materials="materials"
                    :to-gather="toGather" />

        </section>

    </template>

</template>

<style lang="scss">

</style>
