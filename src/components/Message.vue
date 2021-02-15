<template>
    <li class="message-container">
        <div class="message-author"><img v-if="badge != undefined" :src="badge">{{ author }}</div>
        <div class="message-timestamp">{{ timestamp }}</div>
        <div ref="messageContent" class="message-content" v-html="parseEmotes(content)"></div>
    </li>
</template>

<script>
const { EmoteFetcher } = require("@mkody/twitch-emoticons");

var emoteMap = new Map();
var globalMap = new Map();
var BTTVMap = new Map();
var FFZMap = new Map();

const fetcher = new EmoteFetcher();

fetcher.fetchTwitchEmotes(null).then(() => {
    globalMap = new Map([...fetcher.emotes]);

    fetcher.fetchBTTVEmotes(71092938).then(() => {
        BTTVMap = fetcher.emotes;
        console.log("BTTV Emotes");
        console.log(BTTVMap);

        fetcher.fetchFFZEmotes(71092938).then(() => {
            FFZMap = fetcher.emotes;
            emoteMap = new Map([...globalMap,...BTTVMap,...FFZMap]);
            console.log(emoteMap);
        });
    });
});

export default {
    props: {
        author: String,
        timestamp: String,
        badge: String,
        color: String,
        content: String, // use props instead of slots to use and access content data
    },
    methods: {
        syncAnimations: function() {
            console.log("syncing animations");
        },
        parseEmotes(message) {
            const words = message.split(" ");
            words.forEach((word, index) => {
                if (emoteMap.has(word)) {
                    console.log("found emote");
                    words[index] = `<img class="emote" src="${emoteMap.get(word).toLink()}">`; // replace text with image of emote
                }
            });

            return words.join(" ");
        },
    },
    data() {
        
    },
    updated() {
        //console.log("created message element");
        /*
        const words = this.$refs.messageContent.innerHTML.split(" ");
        words.forEach((word, index) => {
            if (emoteMap.has(word)) {
                console.log("found emote");
                words[index] = `<img class="emote" src="${emoteMap.get(word).toLink()}">`;
            }
        });

        this.$refs.messageContent.innerHTML = words.join(" ");*/
    },
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
    color: palegreen;
    font-weight: 600;
}

.message-content {
    vertical-align: middle;
    font-weight: 400;
}

.emote {
    transform: translateY(2px);
}

.rainbow {
    color: rgb(236, 84, 84);
    animation: rainbow-text 4s infinite;
}

@keyframes rainbow-text {
    0% { color: rgb(236, 84, 84); }
    20% { color:  rgb(255, 236, 108); }
    40% { color:  rgb(108, 244, 72); }
    60% { color:  rgb(96, 128, 244); }
    80% { color:  rgb(240, 64, 208); }
    100% { color: rgb(236, 84, 84); }
    /*
    0% { color: orange; }
    25% { color: salmon; }
    50% { color: palevioletred; }
    75% { color: salmon; }
    100% { color: orange; }
    */
}
</style>