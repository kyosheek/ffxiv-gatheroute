<script setup>
import { onBeforeMount, ref } from "vue";

import { tsvParse } from "d3-dsv";

import Router from "../components/common/Router.vue";
import Selector from "../components/common/Selector.vue";

let materials = ref([]);
const toGather = ref({});

let err = ref(null);
let isLoading = ref(true);

onBeforeMount(() => {

    fetch('assets/data/materials.tsv')
        .then(response => {
            err = null;
            return response.text();
        })
        .then(text => tsvParse(text))
        .then(data =>
        {
            materials.value = data.sort();
        })
        .catch(err =>
        {
            err.value = JSON.stringify(err, null, 2);
        })
        .finally(() =>
        {
            isLoading.value = false;
        });
});

const removeItemFromToGatherList = (name) => delete toGather.value[name];
// for plain object
const clearToGatherList = () => { for (let name in toGather.value) { delete toGather.value[name]; }};
</script>

<template>

    <template v-if="err">

        <pre>{{ JSON.stringify(err, null, 2) }}</pre>

    </template>
    <template v-else>

        <section class="materials-wrap"
                 :class="{ 'is-loading': isLoading }">

            <Selector :materials="materials"
                      :to-gather="toGather"
                      @remove-item-from-to-gather-list="removeItemFromToGatherList"
                      @clear-to-gather-list="clearToGatherList"/>

            <div class="materials-delimiter"></div>

            <Router :materials="materials"
                    :to-gather="toGather" />

        </section>

    </template>

</template>

<style lang="scss">

</style>
