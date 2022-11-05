<script>
export default {
    name: 'GatherMap',
    props: {

        materials: {
            type: Array,
            default()
            {
                return [];
            }
        },
        toGather: {

            type: Object,
            default()
            {
                return {};
            }
        }
    },
    data()
    {
        return {

            route: null
        };
    },
    computed: {


    },
    methods: {

    },
}
</script>

<template>
    <article>
        <h2>Route</h2>

        <template v-for="(desc, item) in toGather">
            {{ item }}<br/>{{ JSON.stringify(desc, null, 2) }}<br/>{{ this.materials.filter(material => material.name === item) }}
            <hr/>
        </template>
    </article>
</template>

<style lang="scss">

</style>
