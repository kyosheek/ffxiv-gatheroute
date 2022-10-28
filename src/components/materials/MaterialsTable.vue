<script>
    import { tsvParse } from "d3-dsv";

    import Table from "../ui/Table.vue";

    export default {
        name: 'MaterialsTable',
        components: { Table },
        data() {
            return {
                isLoading: {
                    type: Boolean,
                    default: false,
                },
                rows: {
                    type: Array,
                    default: []
                },
                columns: {
                    type: Array,
                    default: []
                },
                err: {
                    type: String,
                    default: null
                }
            };
        },
        created()
        {
            fetch('assets/data/materials.tsv')
                .then(response => response.text())
                .then(blob => tsvParse(blob))
                .then(data =>
                {
                    this.rows = [...data];
                    // this.columns = data.columns;
                    this.columns = [ 'name', 'quantity' ];
                })
                .catch(err =>
                {
                    this.err = JSON.stringify(err, null, 2);
                })
                .finally(() =>
                {
                    this.isLoading = false;
                });
        }
    }
</script>

<template>
    <section>
        <h2>Materials table</h2>
        <div class="table-wrap" :class="{ 'is-loading': isLoading }">
            <Table :columns="columns"
                   :rows="rows" />
        </div>
    </section>
</template>

<style lang="scss">

</style>
