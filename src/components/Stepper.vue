<script>
export default {
    name: 'Stepper',
    emits: [ 'setNextLoc', 'setPrevLoc' ],
    props: {

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
        },
    },
    data()
    {
        return {};
    },
    computed: {

        items()
        {
            if (JSON.stringify(this.route) === '{}')
            {
                return [];
            }

            return this.route[this.region][this.location].map(item => {

                let action;
                switch(item.profession)
                {
                    case 'hunting':
                        action = `[DoW/DoM] Kill ${item.npc} for`;
                        break;
                    case 'mining':
                        action = `[Miner] Mine lv${item['gathering lv']} nodes for`;
                        break;
                    case 'quarrying':
                        action = `[Miner] Quarry lv${item['gathering lv']} nodes for`;
                        break;
                    case 'logging':
                        action = `[Botanist] Log lv${item['gathering lv']} nodes for`;
                        break;
                    case 'harvesting':
                        action = `[Botanist] Harvest lv${item['gathering lv']} nodes for`;
                        break;
                    case 'fishing':
                        action = `[Fisher] Fish for lv${item['gathering lv']} ${item.name} fish at (${item.x}, ${item.y}) with ${item.bait} bait`;
                        break;
                    case 'buying':
                        action = `[Any] Buy ${item.name} from ${item.npc} at (${item.x}, ${item.y})`;
                        break;
                }
                if (item.profession !== 'buying' && item.profession !== 'fishing')
                {
                    action += ` ${item.quantity} ${item.name} at (${item.x}, ${item.y})`;
                }
                item.action = action;
                return item;
            });
        }
    }
}
</script>

<template>
    <section>
        <button @click="$emit('setPrevLoc')"
                :disabled="!canSetPrevLoc">&lt; Previous</button>
        <button @click="$emit('setNextLoc')"
                :disabled="!canSetNextLoc">Next &gt;</button>
    </section>
    <section>
        <p><b>{{ region }}</b>, {{ location }}</p>
        <template v-for="(item, idx) in items">
            <article style="background-color: aliceblue; border-radius: 8px; border: 1px solid wheat; width: max-content; padding: 5px 10px;">
                <p>
                    <b><i>Step {{ idx + 1 }}</i></b>
                    <br/>
                    {{ item.action }}
                    <template v-if="item.note && item.note.length > 0">
                        <i>{{ item.note }}</i>
                    </template>
                </p>
            </article>
        </template>
    </section>
</template>

<style lang="scss">

</style>
