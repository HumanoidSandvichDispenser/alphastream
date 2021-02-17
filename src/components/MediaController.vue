<template>
    <div class="media-controller">
        <Slider v-model="sliderValue" color="#8ec07c" track-color="#808080" width="100%" step="0" :max="maxValue"/>
    </div>
</template>

<script>
import Slider from "vue3-slider";

export default {
    name: "MediaController",
    components: {
        Slider
    },
    props: {
        value: Number,
        maxValue: Number,
    },
    data() {
        return {
            sliderValue: 0,
        }
    }
}
</script>

<style>
.media-controller {
    position: fixed;
    border-radius: 4px;
    bottom: 16px;
    height: 32px;
}

.slider-container {
    width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    width: 100%; /* Full-width */
    height: 25px; /* Specified height */
    background: #d3d3d3; /* Grey background */
    outline: none; /* Remove outline */
    opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
    -webkit-transition: .2s; /* 0.2 seconds transition on hover */
    transition: opacity .2s;
}

/* Mouse-over effects */
.slider:hover {
    opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb, .slider::-moz-range-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    width: 25px; /* Set a specific slider handle width */
    height: 25px; /* Slider handle height */
    background: #4CAF50; /* Green background */
    cursor: pointer; /* Cursor on hover */
}
</style>