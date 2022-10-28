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
        data()
        {
            return {

                quantity: {},
                showAddPopup: false,
                addPopupIndex: null,
                filterValue: '',
            };
        },
        watch: {

            quantity: {
                deep: true,
                handler()
                {
                    const keys = Object.keys(this.quantity);
                    for (const key of keys)
                    {
                        if (this.quantity[key] === '')
                        {
                            delete this.quantity[key];
                        }
                    }
                }
            }
        },
        computed: {

            hasColumns() { return this.columns.length > 0; },
            hasRows() { return this.rows.length > 0; },
            filteredRows() { return this.rows.filter(row => row.name.includes(this.filterValue)); }
        },
        methods: {

            togglePopup(idx)
            {
                this.addPopupIndex = idx;
                this.showAddPopup = !this.showAddPopup;
            },
            filterInput(evt, name)
            {
                if ([ '-', '+', '.', ',' ].includes(evt.key))
                {
                    evt.preventDefault();
                }

                if (evt.target.value === '')
                {
                    delete this.quantity[name];
                }
            }
        },
    }
</script>

<template>
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
            <template v-for="row in filteredRows">
                <tr>
                    <template v-for="column in columns">
                        <template v-if="column === 'quantity'">
                            <td>
                                <input v-model="quantity[row['name']]"
                                       type="number"
                                       step="1"
                                       min="1"
                                       @keydown="(evt) => filterInput(evt, row['name'])" />
                            </td>
                        </template>
                        <template v-else>
                            <td>{{ row[column] }}</td>
                        </template>
                    </template>
                    <td>{{ (!isNaN(quantity[row['name']]) && quantity[row['name']] !== '') ? quantity[row['name']] : '-' }}</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<style lang="scss">

</style>
