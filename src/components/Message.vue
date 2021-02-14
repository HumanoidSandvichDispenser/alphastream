<template>
    <li class="message-container">
        <div class="rainbow message-author"><img v-if="badge != undefined" :src="badge">{{ author }}</div>
        <div class="message-timestamp">{{ timestamp }}</div>
        <div class="message-content"><slot></slot></div>
    </li>
</template>

<script>
import sync from "css-animation-sync";

export default {
    props: {
        author: String,
        timestamp: String,
        badge: String,
        color: String,
    },
    data() {
    
    },
    created() {
        sync("rainbow-text");
    }
}
</script>

<style>
.message-container {
    list-style: none;
    margin: 0;
    padding: 0;
}

.message-container > * {
    display: block;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin-left: 16px;
    margin-right: 16px;
    text-align: left;
    text-shadow: 1px 1px 3px black,
        -1px -1px 3px  black,
        -1px 1px 3px  black,
        1px -1px 3px  black;
    line-height: 24px;
}

.message-container > * > img {
    transform: translateY(4px);
    margin-right: 4px;
}

.message-author {
    font-weight: 600;
}

.message-content {
    font-weight: 400;
}

.rainbow {
    animation: rainbow-text 2s infinite!important;
}

@keyframes rainbow-text {
    0% { color: rgb(236, 84, 84); }
    20% { color:  rgb(255, 236, 108); }
    40% { color:  rgb(108, 244, 72); }
    60% { color:  rgb(96, 128, 244); }
    80% { color:  rgb(240, 64, 208); }
    100% { color: rgb(236, 84, 84); }
}
</style>