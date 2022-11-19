<script setup>
import { ref, defineProps, computed, defineEmits } from "vue";

defineEmits([ 'removeItemFromToGatherList', 'clearToGatherList' ]);

const props = defineProps({

    materials: {

        type: Array,
        default() { return []; }
    },
    toGather: {

        type: Object,
        default() { return {}; }
    }
});

const currentItem = ref('');

const hasRows = computed(() => props.materials.length > 0);
const currentItemInList = computed(() => {

    return props.materials.filter(row => row.name.toLowerCase() === currentItem.value.toLowerCase()).length === 1;
});
const sortedItemsToGatherKeys = computed(() => Object.keys(props.toGather).sort());

const filterInput = (evt) => {

    if ([ '-', '+', '.', ',', 'e', 'E' ].includes(evt.key))
    {
        evt.preventDefault();
    }
};

const handleInputChange = (evt, name) => {

    if (props.toGather[name] === '' || props.toGather[name] == null)
    {
        delete props.toGather[name];
    }
};
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
                               min="1" step="1"
                               placeholder="0"
                               @keypress="(evt) => filterInput(evt)"
                               @input="(evt) => handleInputChange(evt, currentItem)" />
                    </label>
                </p>
            </template>
        </section>
        <template v-if="sortedItemsToGatherKeys.length > 0">
            <hr/>
            <section>
                <button @click="$emit('clearToGatherList')">Clear list</button>
                <ul class="selector-items">
                    <template v-for="name in sortedItemsToGatherKeys">
                        <li class="item">
                            <div><b>{{ name }}</b><br/><input v-model="toGather[name]"
                                                              type="number"
                                                              min="1" step="1"
                                                              placeholder="0"
                                                              @keypress="(evt) => filterInput(evt)"
                                                              @input="(evt) => handleInputChange(evt, name)" /></div>
                            <button @click="$emit('removeItemFromToGatherList', name)">x</button>
                        </li>
                    </template>
                </ul>
            </section>
        </template>
    </article>
</template>

<style lang="scss">

</style>
