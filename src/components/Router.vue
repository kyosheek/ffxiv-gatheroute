<script>
import { ref } from "vue";

import Stepper from "./Stepper.vue";
import Map from "./Map.vue";

export default {
    name: 'Router',
    setup()
    {
        const map = ref(null);

        return {

            map
        };
    },
    components: { Stepper, Map },
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

            route: {},
            currentRegionIndex: null,
            currentLocationIndex: null,
        };
    },
    computed: {

        materialsToGather()
        {
            const items = Object.keys(this.toGather);
            const filteredItems = this.materials.filter(item => items.includes(item.name));

            filteredItems.forEach(item => {

                item.quantity = this.toGather[item.name];
            });
            return filteredItems;
        },
        materialsToGatherByRegionsAndLocations()
        {
            const items = {};
            const regions = [...new Set(this.materialsToGather.map(el => el.region))];
            for (let region of regions)
            {
                items[region] = {};

                const locations = [...new Set(this.materialsToGather.filter(el => el.region === region).map(el => el.location))];

                for (let location of locations)
                {
                    items[region][location] = this.materialsToGather.filter(el => el.region === region && el.location === location).map(el => {

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
        },
        hasItemsToGather()
        {
            return Object.keys(this.toGather).length > 0;
        },
        routeRegions()
        {
            return Object.keys(this.route);
        },
        currentRegionLocations()
        {
            if (this.currentRegionIndex == null)
            {
                return [];
            }

            const region = this.routeRegions[this.currentRegionIndex];
            return Object.keys(this.route[region]);
        },
        canSetNextLoc()
        {
            return this.currentLocationIndex < this.currentRegionLocations.length - 1 || this.currentRegionIndex < this.routeRegions.length - 1;
        },
        canSetPrevLoc()
        {
            return this.currentLocationIndex > 0 || this.currentRegionIndex > 0;
        }
    },
    methods: {

        solveTravelingSalesmanProblem()
        {
            const resultItems = Object.assign({}, this.materialsToGatherByRegionsAndLocations);
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

                            const newRoute = this.bruteTSP(itemsCopy[idx], itemsCopy.slice(0, idx).concat(itemsCopy.slice(idx + 1, itemsCopy.length)));
                            const newRouteLength = this.calcRouteLength(newRoute);
                            if (newRouteLength < optimalRouteLength)
                            {
                                optimalRouteLength = newRouteLength;
                                resultItems[region][location] = newRoute;
                            }
                        });
                    }
                }
            }
            this.route = resultItems;

            this.currentRegionIndex = 0;
            this.currentLocationIndex = 0;
        },
        calc2dVector(from, to)
        {
            if (isNaN(from.x) || isNaN(from.y) || isNaN(to.x) || isNaN(to.y))
            {
                return Infinity;
            }
            return Math.sqrt(
                Math.pow(to.x - from.x, 2)
                + Math.pow(to.y - from.y, 2)
            );
        },
        bruteTSP(startingNode, nodes, result = [])
        {
            result.push(startingNode);
            if (nodes.length === 0)
            {
                return result;
            }

            let minDistance = Infinity;
            let minDistanceIndex = null;

            nodes.forEach((node, index) => {

                const currentDistance = this.calc2dVector(startingNode, node);
                if (currentDistance < minDistance)
                {
                    minDistance = currentDistance;
                    minDistanceIndex = index;
                }
            });

            const newStartingNode = nodes.splice(minDistanceIndex, 1)[0];
            return this.bruteTSP(newStartingNode, nodes, result);
        },
        calcRouteLength(nodes)
        {
            let len = 0;
            nodes.forEach((node, idx) =>
            {
                if (idx > 0)
                {
                    const dist = this.calc2dVector(nodes[idx - 1], node);
                    len += dist === Infinity ? 0 : dist;
                }
            });
            return len;
        },
        initRouting()
        {
            this.solveTravelingSalesmanProblem();
        },
        setNextLoc()
        {
            if (this.canSetNextLoc)
            {
                this.currentLocationIndex += 1;
                if (this.currentLocationIndex >= this.currentRegionLocations.length)
                {
                    this.currentLocationIndex = 0;
                    this.currentRegionIndex += 1;
                }
            }
        },
        setPrevLoc()
        {
            if (this.canSetPrevLoc)
            {
                this.currentLocationIndex -= 1;
                if (this.currentLocationIndex < 0)
                {
                    this.currentRegionIndex -= 1;
                    this.currentLocationIndex = this.currentRegionLocations.length - 1;
                }
            }
        }
    },
}
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
