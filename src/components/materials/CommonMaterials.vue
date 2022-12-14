<script setup>

import { computed } from "vue";

defineEmits([ 'setNextLoc', 'setPrevLoc' ]);

const props = defineProps({

    route: {

        type: Object,
        default() { return {}; }
    },
    region: {

        type: String,
        default: null
    },
    location: {

        type: String,
        default: null
    },
    canSetNextLoc: {

        type: Boolean,
        default: false,
    },
    canSetPrevLoc: {

        type: Boolean,
        default: false,
    }
});

const items = computed(() => {

    if (JSON.stringify(props.route) === '{}')
    {
        return [];
    }

    return props.route[props.region][props.location].map(item => {

        let action;

        if (item.aetheryte)
        {
            action = `TP to ${item.name}`;
        }
        else
        {
            switch(item.profession)
            {
                case 'hunting':
                    action = `[DoW/DoM] Kill lv${item.lv} ${item.npc} for`;
                    break;
                case 'mining':
                    action = `[Miner] Mine lv${item.lv} nodes for`;
                    break;
                case 'quarrying':
                    action = `[Miner] Quarry lv${item.lv} nodes for`;
                    break;
                case 'logging':
                    action = `[Botanist] Log lv${item.lv} nodes for`;
                    break;
                case 'harvesting':
                    action = `[Botanist] Harvest lv${item.lv} nodes for`;
                    break;
                case 'fishing':
                    action = `[Fisher] Fish for ${item.quantity} lv${item.lv} ${item.name} fish at (${item.x}, ${item.y}) with ${item.bait} bait`;
                    break;
                case 'buying':
                    action = `[Any] Buy ${item.quantity} ${item.name} from ${item.npc} at (${item.x}, ${item.y})`;
                    break;
                default:
                    action = `No switch case for profession ${item.profession}. Please report a bug at https://github.com/kyosheek/ffxiv-gatheroute/issues/new`;
                    break;
            }

            if (![ 'buying', 'fishing' ].includes(item.profession)) {

                action += ` ${item.quantity} ${item.name} at (${item.x}, ${item.y})`;
                const time = item.time;

                if (time.length > 0) {
                    action += ` at ${time} (Eorzea time)`;
                }
            }

            if (item.profession === 'fishing') {

                const weather = item.weather,
                    time = item.time,
                    special = item.special;

                if (weather.length > 0) {
                    action += ` in ${weather} weather`;
                }

                if (time.length > 0) {
                    action += ` at ${time} (Eorzea time)`;
                }

                if (special.length > 0) {
                    action += ` (with ${special} condition)`
                }
            }
        }

        item.action = action;
        return item;
    });
});
</script>

<template>
    <section>
        <button @click="$emit('setPrevLoc')"
                :disabled="!canSetPrevLoc">&lt; Previous Step</button>
        <button @click="$emit('setNextLoc')"
                :disabled="!canSetNextLoc">Next Step &gt;</button>
    </section>
    <section v-if="region != null && location != null">
        <h3 class="stepper__location">{{ region }}, <b>{{ location }}</b></h3>
        <section class="stepper__items">
            <template v-for="(item, idx) in items">
                <article class="item">
                    <p>
                        <b><i>Step {{ idx + 1 }}</i></b>
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
    </section>
</template>

<style lang="scss">

</style>
