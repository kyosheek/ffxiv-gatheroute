<script setup>
import { ref, defineProps, computed } from "vue";

import Stepper from "./Stepper.vue";
import Map from "./Map.vue";

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

const route = ref({});
const currentRegionIndex = ref(null);
const currentLocationIndex = ref(null);

const materialsToGather = computed(() => {

    const items = Object.keys(props.toGather);
    const filteredItems = props.materials.filter(item => items.includes(item.name));

    filteredItems.forEach(item => {

        item.quantity = props.toGather[item.name];
    });
    return filteredItems;
});

const materialsToGatherByRegionsAndLocations = computed(() => {

    const items = {};
    const regions = [...new Set(materialsToGather.value.map(el => el.region))];
    for (let region of regions)
    {
        items[region] = {};

        const locations = [...new Set(materialsToGather.value.filter(el => el.region === region).map(el => el.location))];

        for (let location of locations)
        {
            items[region][location] = materialsToGather.value.filter(el => el.region === region && el.location === location).map(el => {

                const splitRoute = el.coordinates.split(';');
                if (splitRoute.length > 0)
                {
                    const coordinates = splitRoute[0].split(',');
                    if (coordinates.length === 0)
                    {
                        el.x = NaN;
                        el.y = NaN;
                    }
                    else
                    {
                        el.x = parseInt(coordinates[0]);
                        el.y = parseInt(coordinates[1]);
                    }
                }
                else
                {
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

const routeRegions = computed(() => Object.keys(route.value));

const currentRegionLocations = computed(() => {

    if (currentRegionIndex.value == null)
    {
        return [];
    }

    const region = routeRegions.value[currentRegionIndex.value];
    return Object.keys(route.value[region]);
});

const canSetNextLoc = computed(() => {

    return currentLocationIndex.value < currentRegionLocations.length - 1 || currentRegionIndex.value < routeRegions.value.length - 1;
});

const canSetPrevLoc = computed(() => {

    return currentLocationIndex.value > 0 || currentRegionIndex.value > 0;
});

const solveTravelingSalesmanProblem = () =>
{
    const resultItems = Object.assign({}, materialsToGatherByRegionsAndLocations.value);

    for(const region in resultItems)
    {
        for (const location in resultItems[region])
        {
            const items = resultItems[region][location];
            if (items.length > 2)
            {
                let optimalRouteLength = Infinity;
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

const initRouting = () => solveTravelingSalesmanProblem();

const setNextLoc = () => {

    if (canSetNextLoc)
    {
        currentLocationIndex.value += 1;
        if (currentLocationIndex.value >= currentRegionLocations.length)
        {
            currentLocationIndex.value = 0;
            currentRegionIndex.value += 1;
        }
    }
};

const setPrevLoc = () => {

    if (canSetPrevLoc)
    {
        currentLocationIndex.value -= 1;
        if (currentLocationIndex.value < 0)
        {
            currentRegionIndex.value -= 1;
            currentLocationIndex.value = currentRegionLocations.length - 1;
        }
    }
};
</script>

<template>
    <article>
        <h2>Route</h2>

        <section>
            <button :disabled="!hasItemsToGather"
                    @click="initRouting">
                Get Route
            </button>

            <section>

                <Stepper :route="route"
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

    </article>
</template>

<style lang="scss">

</style>
