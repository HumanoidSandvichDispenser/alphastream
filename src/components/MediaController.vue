<template>
    <div class="media-controller">
        <div class="slider-container">
            <Slider v-model="sliderValue" :step="-1" :min="0" :max="maxValue" :format="formatTime" @change="$emit('change', $event)"/>
        </div>
    </div>
</template>

<script>
import Slider from "@vueform/slider";

export default {
    name: "MediaController",
    components: {
        Slider
    },
    props: {
        value: Number,
        maxValue: Number,
        sliderVisible: Boolean,
    },
    watch: {
        value: function(newVal) {
            console.log("value changed to " + newVal);
            this.sliderValue = newVal;
        }
    },
    data() {
        return {
            sliderValue: 0,
        }
    },
    methods: {
        formatTime: function(duration) {
            const durationNumber = new Number(duration);

            // Hours, minutes and seconds
            var hrs = ~~(durationNumber / 3600);
            var mins = ~~((durationNumber % 3600) / 60);
            var secs = ~~durationNumber % 60;

            // Output like "1:01" or "4:03:59" or "123:03:59"
            var format = "";

            if (hrs > 0) {
                format += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }

            format += "" + mins + ":" + (secs < 10 ? "0" : "");
            format += "" + secs;
            return format;
        }
    }
}
</script>

<style>
.media-controller {
    position: fixed;
    border-radius: 4px;
    bottom: 48px;
    left: 48px;
    right: 48px;
    height: 48px;
    background-color: #282828ee;
}

.slider-container {
    margin: 20px 16px 20px 16px;
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

<style src="@vueform/slider/themes/default.css"></style>