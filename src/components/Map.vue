<script setup>
import { ref, defineProps, watch, computed, onMounted } from "vue";

const map = ref(null);
const mapContainer = ref(null);

const props = defineProps({

    route: {

        type: Object,
        default() { return {}; },
    },
    region: {

        type: String,
        default: null,
    },
    location: {

        type: String,
        default: null
    }
});

const dimensions = ref({

    width: 600,
    height: 600,
    left: 1,
    right: 42,
    top: 1,
    bottom: 42
});

const context = ref(null);
const mapImage = ref(null);
const images = ref({});
const isDrawing = ref(false);
const observer = ref(null);

watch(() => props.route, () => {

    draw();
});

watch(() => [ props.region, props.location ], ([ newRegionVal, newLocationVal ]) => {

    if (newRegionVal || newLocationVal) draw();
});

const canDraw = computed(() => props.region && props.location);

const draw = () => {

    if (isDrawing.value) return;
    if (!canDraw.value) return;

    isDrawing.value = true;

    loadMap()
        .then(() => drawMap())
        .catch(err => console.error(err))
        .finally(() => isDrawing.value = false)
};

const clearMap = () => context.value.clearRect(0, 0, dimensions.value.width, dimensions.value.height);

const drawMap = () => {

    const ctx = context.value;
    const d = dimensions.value;

    clearMap();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, d.width, d.height);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'red';

    ctx.drawImage(mapImage.value, 0, 0, d.width, d.height);

    const items = props.route[props.region][props.location];

    let prevX = null,
        prevY = null;

    items.forEach(item => {

        if (!isNaN(item.x) && !isNaN(item.y))
        {
            let x, y;

            if (item.location.includes('Limsa Lominsa'))
            {
                x = item.x / (d.right / 2 - d.left) * d.width;
                y = item.y / (d.bottom / 2 - d.top) * d.height;
            }
            else
            {
                x = item.x / (d.right - d.left) * d.width;
                y = item.y / (d.bottom - d.top) * d.height;
            }

            const line = new Path2D();
            if (prevX == null || prevY == null)
            {
                prevX = x;
                prevY = y;
            }
            else
            {
                line.moveTo(prevX, prevY);
                line.lineTo(x, y);
                prevX = x;
                prevY = y;

                ctx.stroke(line);
            }

            const arc = new Path2D();

            if (item.profession === 'buying')
            {
                arc.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill(arc);
            }
            else
            {
                arc.arc(x, y, 20, 0, 2 * Math.PI);
            }
            ctx.stroke(arc);
        }
    });

    ctx.textAlign = 'center';
    ctx.font = '24px sans-serif';
    items.forEach((item, idx) => {

        if (!isNaN(item.x) && !isNaN(item.y))
        {
            const x = item.x / (d.right - d.left) * d.width,
                y = item.y / (d.bottom - d.top) * d.height;

            ctx.fillText(idx + 1, x, y + 6);
        }
    });
};

const loadMap = () => {

    return new Promise(resolve => {

        const imageLocation = `${props.region}/${props.location}`;

        if (images[imageLocation])
        {
            mapImage.value = images[imageLocation];
            return resolve();
        }

        const fetchHeaders = {
            "Content-Type": "image/png",
            Accept: "image/png",
        };

        fetch(`/assets/images/maps/${imageLocation}.png`, { headers: fetchHeaders })
            .then(response => {
                if (response.ok)
                {
                    return response.blob()
                }
                else
                {
                    throw new Error('Can\'t fetch image');
                }
            })
            .then((imageBlob) => {

                const image = new Image();
                image.src = URL.createObjectURL(imageBlob);

                return image.onload = () => {

                    images.value[imageLocation] = image;
                    mapImage.value = image;

                    return resolve();
                };
            })
            .catch(err => {

                console.error(err);
                clearMap();
                isDrawing.value = false;
            });
    });
};

const resizeMap = () => {

    const rect = mapContainer.value.getBoundingClientRect();
    const d = dimensions.value;

    let isCurrentWidthOffscreen = (rect.x + parseFloat(map.value.getAttribute('width'))) > window.innerWidth;

    let sideLength = 0;
    if (isCurrentWidthOffscreen)
    {
        sideLength = Math.min(window.innerWidth - rect.x - 10, rect.height);
    }
    else
    {
        sideLength = Math.min(d.width, Math.min(rect.width, rect.height));
    }

    if (sideLength !== d.width)
    {
        d.width = sideLength;
        d.height = sideLength;

        map.value.style.width = `${sideLength}px`;
        map.value.style.height = `${sideLength}px`;

        map.value.setAttribute('width', sideLength);
        map.value.setAttribute('height', sideLength);

        ctx.value = map.value.getContext('2d');

        draw();
    }
};

onMounted(() => {

    context.value = map.value.getContext('2d');

    var debounceTimeoutHandler;
    const resizeObserver = new ResizeObserver(() =>
    {
        clearTimeout(debounceTimeoutHandler);
        debounceTimeoutHandler = setTimeout(() =>
            {
                resizeMap();
            },
            250);
    });
    resizeObserver.observe(mapContainer.value);

    observer.value = resizeObserver;
})

</script>

<template>
    <section id="map-container"
             ref="mapContainer"
             :class="{ 'is-loading': isDrawing }">
        <canvas id="map"
                :style="{
                        width: dimensions.width + 'px',
                        height: dimensions.height + 'px'
                     }"
                :width="dimensions.width" :height="dimensions.height"
                ref="map"></canvas>
    </section>
</template>

<style lang="scss"></style>
