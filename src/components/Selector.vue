<script>
    export default {
        name: 'Selector',
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

                columns: [ 'name', 'quantity' ],
                err: null,
                filterValue: '',
                currentItem: null,
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
                if ([ '-', '+', '.', ',', 'e', 'E' ].includes(evt.key))
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
            },
            removeItemFromGatherList(name)
            {
                delete this.toGather[name];
            }
        },
    }
</script>

<template>
    <article>
        <h2>Materials</h2>
        <section>
            <select autocomplete="on"
                    v-model="currentItem">
                <template v-if="hasRows">
                    <option :value="null"
                            disabled>Choose an item</option>
                    <template v-for="row in filteredRows"
                              :key="row.name" >
                        <option :value="row.name">{{ row.name }}</option>
                    </template>
                </template>
            </select>
            <template v-if="currentItem">
                <br/>
                <p>
                    <label>
                        Quantity:
                        <input v-model="toGather[currentItem]"
                               type="number"
                               step="1"
                               min="1"
                               placeholder="0"
                               @keypress="(evt) => filterInput(evt)"
                               @input="(evt) => handleInputChange(evt, currentItem)" />
                    </label>
                </p>
            </template>
        </section>
        <template v-if="Object.keys(toGather).length > 0">
            <section class="selector-items">
                <template v-for="(quantity, name) in toGather">
                    <div class="item">
                        <div><b>{{ name }}</b><br/><i>{{ quantity }}</i></div>
                        <button @click="() => removeItemFromGatherList(name)">x</button>
                    </div>
                </template>
            </section>
        </template>
    </article>
</template>

<style lang="scss">

</style>
