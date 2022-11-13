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
                currentItem: '',
            };
        },
        computed: {

            hasRows() { return this.materials.length > 0; },
            currentItemInList() { return this.materials.filter(row => row.name.toLowerCase() === this.currentItem.toLowerCase()).length === 1 }
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
            },
        },
    }
</script>

<template>
    <article>
        <h2>Materials</h2>
        <section>
            <input list="materials"
                   name="materials"
                   id="materials-input"
                   placeholder="Select Items"
                   v-model="currentItem" />

            <datalist id="materials">
                <template v-if="hasRows">
                    <template v-for="item in materials"
                              :key="item.name" >
                        <option>{{ item.name }}</option>
                    </template>
                </template>
            </datalist>

            <template v-if="currentItemInList">
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
            <hr/>
            <section>
                <ul class="selector-items">
                    <template v-for="(quantity, name) in toGather">
                        <li class="item">
                            <div><b>{{ name }}</b><br/><i>{{ quantity }}</i></div>
                            <button @click="() => removeItemFromGatherList(name)">x</button>
                        </li>
                    </template>
                </ul>
            </section>
        </template>
    </article>
</template>

<style lang="scss">

</style>
