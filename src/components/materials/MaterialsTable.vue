<script>
    export default {
        name: 'MaterialsTable',
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

                columns: [ 'name', 'to gather' ],
                err: null,
                filterValue: '',
            };
        },
        computed: {

            hasColumns() { return this.columns.length > 0; },
            hasRows() { return this.materials.length > 0; },
            filteredRows() { return this.materials.filter(row => row.name.toLowerCase().includes(this.filterValue.toLowerCase())); }
        },
        methods: {

            filterInput(evt)
            {
                if ([ '-', '+', '.', ',' ].includes(evt.key))
                {
                    evt.preventDefault();
                }
            },
            handleInputChange(evt, name)
            {
                if (this.toGather[name] === '' || this.toGather[name] == null)
                {
                    delete this.toGather[name];
                }
            }
        },
    }
</script>

<template>
    <article>
        <h2>Materials table</h2>
        <div class="table-wrap">
            <table>
                <thead v-if="hasColumns">
                    <tr>
                        <template v-for="column in columns">
                            <th>
                                <span>{{ column }}</span>
                                <template v-if="column === 'name'">
                                    <br/>
                                    <label>filter:<input v-model="filterValue" /></label>
                                </template>
                            </th>
                        </template>
                        <th>to gather</th>
                    </tr>
                </thead>
                <tbody v-if="hasRows">
                    <template v-if="filteredRows.length > 0">
                        <tr v-for="row in filteredRows">
                            <template v-for="column in columns">
                                <template v-if="column === 'to gather'">
                                    <td>
                                        <input v-model="toGather[row['name']]"
                                               type="number"
                                               step="1"
                                               min="1"
                                               placeholder="0"
                                               @keypress="(evt) => filterInput(evt)"
                                               @input="(evt) => handleInputChange(evt, row['name'])" />
                                    </td>
                                </template>
                                <template v-else>
                                    <td>{{ row[column] }}</td>
                                </template>
                            </template>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td :colspan="columns.length">
                                No entries
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </article>
</template>

<style lang="scss">

</style>
