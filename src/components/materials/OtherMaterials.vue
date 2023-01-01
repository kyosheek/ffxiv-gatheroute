<script setup>

import { computed } from "vue";

const props = defineProps({

    materials: {

        type: Array,
        default() { return []; }
    },
});

const items = computed(() => {

    if (props.materials.length === 0)
    {
        return [];
    }

    return props.materials.map(item => {

        let action = null;
        switch (item.region)
        {
            case 'Dungeon':
                action = `Run ${item.location} for ${item.quantity} ${item.name}`;
                break;
            case 'Voyage':
                action = `Complete ${item.location} for ${item.quantity} ${item.name}`;
                break;
            case 'Treasure Map':
                action = `Obtain ${item.quantity} ${item.name} from following treasure maps: ${item.location}`;
                break;
            case 'Quest':
                action = `Get ${item.location} quest from ${item.npc}`;
                break;
            case 'Raid':
                action = `Complete ${item.lv}lv ${item.region} raid`;
                break;
            case 'Trial':
                action = `Complete ${item.lv}lv ${item.region} trial`;
                break;
            case 'Retainer':
                action = `Send retainer to ${item.location} ventures`
                break;
            case 'Gardening':
                action = `Plant then gather ${item.location}`;
                break;
            default:
                action = `No switch case for region (${item.region}). Please report a bug at https://github.com/kyosheek/ffxiv-gatheroute/issues/new`;
                break;
        }

        item.action = action;
        return item;
    });
});
</script>

<template>

    <section class="stepper__items stepper__items_other">
        <template v-for="(item, idx) in items">
            <article class="item">
                <p>
                    <b>x{{ item.quantity }} {{ item.name }}</b>
                    <br/>
                    {{ item.action }}
                    <template v-if="item.note && item.note.length > 0">
                        <br/>
                        <i>{{ item.note }}</i>
                    </template>
                </p>
            </article>
        </template>
    </section>

</template>

<style lang="scss">

</style>
