<script setup>
import { ref, computed } from "vue";

import Map from "../materials/Map.vue";
import OtherMaterials from "../materials/OtherMaterials.vue";
import CommonMaterials from "../materials/CommonMaterials.vue";

const props = defineProps({

    materials: {

       type: Array,
       default() { return []; }
    },
    aetherytes: {

        type: Array,
        default() { return []; }
    },
    toGather: {

       type: Object,
        default() { return {}; }
    }
});

const route = ref({});
const currentRegionIndex = ref(null);
const currentLocationIndex = ref(null);

const shownTab = ref('materials');

const filteredItems = computed(() => {

    const items = Object.keys(props.toGather);
    return props.materials.filter(item => items.includes(item.name));
});

const materialsToGather = computed(() => {

    const items = filteredItems.value.filter(item => item.profession !== 'other' && item.time.length === 0);

    items.forEach(item => {

        item.quantity = props.toGather[item.name];
    });

    return items;
});

const timeRestrictedMaterialsToGather = computed(() => {

    const items = filteredItems.value.filter(item => item.profession !== 'other' && item.time.length > 0);
    items.forEach(item => {

        item.quantity = props.toGather[item.name];
    });
    items.sort((a, b) => a.time.localeCompare(b.time));

    return items;
});

const otherMaterialsToGather = computed(() => {

    const items = filteredItems.value.filter(item => item.profession === 'other');
    items.forEach(item => {

        item.quantity = props.toGather[item.name];
    });
    return items;
});

const materialsToGatherByRegionsAndLocations = computed(() => {

    const items = {};
    const regions = [...new Set(materialsToGather.value.map(el => el.region))];
    for (let region of regions) {

        items[region] = {};

        const locations = [...new Set(materialsToGather.value.filter(el => el.region === region).map(el => el.location))];

        for (let location of locations) {

            items[region][location] = materialsToGather.value.filter(el => el.region === region && el.location === location).map(el => {

                const splitRoute = el.coordinates.split(';');
                if (splitRoute.length > 0) {

                    const coordinates = splitRoute[0].split(',');
                    if (coordinates.length === 0) {

                        el.x = NaN;
                        el.y = NaN;
                    }
                    else {

                        el.x = parseFloat(coordinates[0]);
                        el.y = parseFloat(coordinates[1]);
                    }
                }
                else {

                    el.x = NaN;
                    el.y = NaN;
                }
                return el;
            });
        }
    }
    return items;
});

const aetherytesByRegionsAndLocations = computed(() => {

    const items = {};
    const regions = [...new Set(props.aetherytes.map(el => el.region))];
    for (let region of regions) {

        items[region] = {};

        const locations = [...new Set(props.aetherytes.filter(el => el.region === region).map(el => el.location))];

        for (let location of locations) {

            items[region][location] = props.aetherytes.filter(el => el.region === region && el.location === location).map(el => {

                el.aetheryte = true;
                const splitRoute = el.coordinates.split(';');
                if (splitRoute.length > 0) {

                    const coordinates = splitRoute[0].split(',');
                    if (coordinates.length === 0) {

                        el.x = NaN;
                        el.y = NaN;
                    }
                    else {

                        el.x = parseFloat(coordinates[0]);
                        el.y = parseFloat(coordinates[1]);
                    }
                }
                else  {

                    el.x = NaN;
                    el.y = NaN;
                }
                return el;
            });
        }
    }
    return items;
});

const hasItemsToGather = computed(() => Object.keys(props.toGather).length > 0);

const routeRegions = computed(() => Object.keys(route.value).sort());

const currentRegionLocations = computed(() => {

    const hasRoute = Object.keys(route.value).length > 0;
    if (currentRegionIndex.value == null || !hasRoute) {

        return [];
    }

    const region = routeRegions.value[currentRegionIndex.value];
    return Object.keys(route.value[region]);
});

const canSetNextLoc = computed(() => {

    return currentLocationIndex.value < currentRegionLocations.value.length - 1 || currentRegionIndex.value < routeRegions.value.length - 1;
});

const canSetPrevLoc = computed(() => {

    return currentLocationIndex.value > 0 || currentRegionIndex.value > 0;
});

const solveTravelingSalesmanProblem = () => {

    const resultItems = Object.assign({}, materialsToGatherByRegionsAndLocations.value);

    for (const region in resultItems)
    {
        for (const location in resultItems[region])
        {
            const items = resultItems[region][location].filter(item => !item.aetheryte);

            const aetherytes = aetherytesByRegionsAndLocations.value?.[region]?.[location] ?? [];

            let optimalRouteLength = Infinity;

            if (aetherytes.length > 0)
            {
                aetherytes.forEach(aetheryte => {

                    const newRoute = bruteTSP(aetheryte, [].concat(items));
                    const newRouteLength = calcRouteLength(newRoute);

                    if (newRouteLength < optimalRouteLength)
                    {
                        optimalRouteLength = newRouteLength;
                        resultItems[region][location] = newRoute;
                    }
                });
            }
            else
            {
                const itemsCopy = [].concat(items);
                itemsCopy.forEach((node, idx) => {

                    const newRoute = bruteTSP(itemsCopy[idx], itemsCopy.slice(0, idx).concat(itemsCopy.slice(idx + 1, itemsCopy.length)));
                    const newRouteLength = calcRouteLength(newRoute);

                    if (newRouteLength < optimalRouteLength)
                    {
                        optimalRouteLength = newRouteLength;
                        resultItems[region][location] = newRoute;
                    }
                });
            }
        }
    }
    route.value = resultItems;

    currentRegionIndex.value = 0;
    currentLocationIndex.value = 0;
};

const calc2dVector = (from, to) =>
{
    if (isNaN(from.x) || isNaN(from.y) || isNaN(to.x) || isNaN(to.y))
    {
        return Infinity;
    }
    return Math.sqrt(
        Math.pow(to.x - from.x, 2)
        + Math.pow(to.y - from.y, 2)
    );
};

const bruteTSP = (startingNode, nodes, result = []) =>
{
    result.push(startingNode);
    if (nodes.length === 0)
    {
        return result;
    }

    let minDistance = Infinity;
    let minDistanceIndex = null;

    nodes.forEach((node, index) => {

        const currentDistance = calc2dVector(startingNode, node);
        if (currentDistance < minDistance)
        {
            minDistance = currentDistance;
            minDistanceIndex = index;
        }
    });

    const newStartingNode = nodes.splice(minDistanceIndex, 1)[0];

    return bruteTSP(newStartingNode, nodes, result);
};

const calcRouteLength = (nodes) =>
{
    let len = 0;
    nodes.forEach((node, idx) =>
    {
        if (idx > 0)
        {
            const dist = calc2dVector(nodes[idx - 1], node);
            len += dist === Infinity ? 0 : dist;
        }
    });
    return len;
};

const initRouting = () => {

    route.value = {};
    solveTravelingSalesmanProblem();
}

const setNextLoc = () => {

    if (canSetNextLoc.value) {

        currentLocationIndex.value += 1;
        if (currentLocationIndex.value >= currentRegionLocations.value.length) {

            currentLocationIndex.value = 0;
            currentRegionIndex.value += 1;
        }
    }
};

const setPrevLoc = () => {

    if (canSetPrevLoc.value) {

        currentLocationIndex.value -= 1;
        if (currentLocationIndex.value < 0) {

            currentRegionIndex.value -= 1;
            currentLocationIndex.value = currentRegionLocations.value.length - 1;
        }
    }
};
</script>

<template>
    <article>
        <div class="tabs-headings">
            <h2 class="tab-heading"
                :class="{ 'tab-heading_active': shownTab === 'materials' }"
                @click="shownTab = 'materials'">Route ({{ materialsToGather.length }})</h2>
            <h2 class="tab-heading"
                :class="{ 'tab-heading_active': shownTab === 'timeRestrictedMaterials' }"
                @click="shownTab = 'timeRestrictedMaterials'">Time Restricted Materials ({{ timeRestrictedMaterialsToGather.length }})</h2>
            <h2 class="tab-heading"
                :class="{ 'tab-heading_active': shownTab === 'otherMaterials' }"
                @click="shownTab = 'otherMaterials'">Other Materials ({{ otherMaterialsToGather.length }})</h2>
        </div>

        <section v-if="shownTab === 'materials'">

            <button :disabled="!hasItemsToGather"
                    @click="initRouting">
                Get Route
            </button>

            <section>

                <CommonMaterials :route="route"
                                 :region="routeRegions[currentRegionIndex]"
                                 :location="currentRegionLocations[currentLocationIndex]"
                                 :can-set-next-loc="canSetNextLoc"
                                 :can-set-prev-loc="canSetPrevLoc"
                                 @set-prev-loc="setPrevLoc"
                                 @set-next-loc="setNextLoc"/>

                <Map :route="route"
                     :region="routeRegions[currentRegionIndex]"
                     :location="currentRegionLocations[currentLocationIndex]" />

            </section>
        </section>

        <section v-if="shownTab === 'timeRestrictedMaterials'"
                 class="stepper__items">
            <template v-for="item in timeRestrictedMaterialsToGather">
                <article class="item">
                    <p>
                        x{{ item.quantity }} <b>{{ item.name }}</b> ({{ item.profession }})
                        <br/>
                        <i>{{ item.region }}, {{ item.location }}</i>
                        <br/>
                        <br/>
                        <b>{{ item.time }}</b> Eorzea Time
                    </p>
                </article>
            </template>
        </section>

        <template v-if="shownTab === 'otherMaterials'">

            <OtherMaterials :materials="otherMaterialsToGather"/>

        </template>

    </article>
</template>

<style lang="scss">

.tabs {
    &-headings {
        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: 4px solid var(--c-3);

        white-space: nowrap;

        overflow-x: scroll;
    }
}

.tab-heading {

    cursor: pointer;
    padding: 0.83em 1em;
    margin-block-start: unset;
    margin-block-end: unset;

    &_active {

        position: relative;
        cursor: default;
        pointer-events: none;

        color: var(--c-4);

        &::before {
            display: block;
            content: "";

            position: absolute;
            bottom: -4px;
            left: 0;

            width: 100%;
            height: 4px;

            background: var(--c-8);
        }
    }
}

</style>
