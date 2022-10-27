<script>
    export default {
        name: 'Table',
        props: {
            columns: {
                type: Array,
                default() { return []; }
            },
            rows: {
                type: Array,
                default() { return []; }
            }
        },
        computed: {
            hasColumns() { return this.columns.length > 0; },
            hasRows() { return this.rows.length > 0; }
        }
    }
</script>

<template>
    <table>
        <thead v-if="hasColumns">
            <tr>
                <template v-for="column in columns">
                    <th>{{ column }}</th>
                </template>
            </tr>
        </thead>
        <tbody v-if="hasRows">
            <template v-for="row in rows">
                <tr>
                    <template v-for="column in columns">
                        <td>{{ row[column] }}</td>
                    </template>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<style lang="scss">

</style>
