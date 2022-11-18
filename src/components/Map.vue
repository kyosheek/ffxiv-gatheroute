<script>
import { ref } from "vue";

export default {
    name: 'Map',
    setup()
    {
        const map = ref(null);
        const mapContainer = ref(null);

        return {

            map, mapContainer
        };
    },
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
        }
    },
    data()
    {
        return {

            dimensions: {
                width: 600,
                height: 600,
                left: 1,
                right: 42,
                top: 1,
                bottom: 42
            },
            ctx: null,
            mapImage: null,
            images: {},
            isDrawing: false,
            observer: null,
        };
    },
    watch: {

        route: {

            deep: true,
            handler()
            {
                this.draw();
            }
        },
        region(newVal)
        {
            if (newVal)
            {
                this.draw();
            }
        },
        location(newVal)
        {
            if (newVal)
            {
                this.draw();
            }
        }
    },
    computed: {

        canDraw()
        {
            return this.region && this.location;
        }
    },
    methods: {

        draw()
        {
            if (this.isDrawing) return;
            if (!this.canDraw) return;

            this.isDrawing = true;

            this.loadMap()
                .then(() => this.drawMap())
                .catch(err => console.error(err))
                .finally(() => this.isDrawing = false);
        },
        drawMap()
        {
            const ctx = this.ctx;
            const d = this.dimensions;

            ctx.clearRect(0, 0, d.width, d.height);
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, d.width, d.height);
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'red';

            ctx.drawImage(this.mapImage, 0, 0, this.dimensions.width, this.dimensions.height);

            const items = this.route[this.region][this.location];

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
        },
        loadMap()
        {
            return new Promise(resolve => {

                const imageLocation = `${this.region}/${this.location}`;

                if (this.images[imageLocation])
                {
                    this.mapImage = this.images[imageLocation];
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
                            response.blob()
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

                            this.images[imageLocation] = image;
                            this.mapImage = image;

                            return resolve();
                        };
                    })
                    .catch(err => {

                        console.error(err);
                        this.isDrawing = false;
                    });
            });
        },
        resizeMap()
        {
            const rect = this.mapContainer.getBoundingClientRect();

            let isCurrentWidthOffscreen = (rect.x + parseFloat(this.map.getAttribute('width'))) > window.innerWidth;

            let sideLength = 0;
            if (isCurrentWidthOffscreen)
            {
                sideLength = Math.min(window.innerWidth - rect.x - 10, rect.height);
            }
            else
            {
                sideLength = Math.min(this.dimensions.width, Math.min(rect.width, rect.height));
            }

            if (sideLength !== this.dimensions.width)
            {
                this.dimensions.width = sideLength;
                this.dimensions.height = sideLength;

                this.map.style.width = `${sideLength}px`;
                this.map.style.height = `${sideLength}px`;

                this.map.setAttribute('width', sideLength);
                this.map.setAttribute('height', sideLength);

                this.ctx = this.map.getContext('2d');

                this.draw();
            }
        }
    },
    mounted()
    {
        this.ctx = this.map.getContext('2d');

        var debounceTimeoutHandler;
        const resizeObserver = new ResizeObserver(() =>
        {
            clearTimeout(debounceTimeoutHandler);
            debounceTimeoutHandler = setTimeout(() =>
                {
                    this.resizeMap();
                },
                250);
        });
        resizeObserver.observe(this.mapContainer);

        this.observer = resizeObserver;
    }
}
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
