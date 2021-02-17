<template>
    <li class="message-container">
        <div class="message-author"><img v-if="badge != undefined" class="message-content" :src="badge">{{ author }}</div>
        <div class="message-timestamp">{{ timestamp }}</div>
        <span ref="messageContent" class="message-content" v-html="parseEmotes(content)"></span>
    </li>
</template>

<script>
const { EmoteFetcher } = require("@mkody/twitch-emoticons");

var emoteMap = new Map();

const fetcher = new EmoteFetcher();

fetcher.fetchTwitchEmotes().then(() => {
    emoteMap = new Map([...emoteMap, ...fetcher.emotes]);
    fetcher.fetchBTTVEmotes().then(() => { // fetch emotes in ordere to make sure they are added correctly
        emoteMap = new Map([...emoteMap, ...fetcher.emotes]);
        fetcher.fetchFFZEmotes().then(() => {
            emoteMap = new Map([...emoteMap, ...fetcher.emotes]);
        });
    });
});

fetcher.fetchTwitchEmotes(71092938).then(() => {
    emoteMap = new Map([...emoteMap, ...fetcher.emotes]);
    fetcher.fetchBTTVEmotes(71092938).then(() => { // fetch emotes in ordere to make sure they are added correctly
        emoteMap = new Map([...emoteMap, ...fetcher.emotes]);
        fetcher.fetchFFZEmotes(71092938).then(() => {
            emoteMap = new Map([...emoteMap, ...fetcher.emotes]);
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
        parseEmotes: function(message) {
            if (message == undefined)
                return;

            const words = message.split(" ");
            words.forEach((word, index) => {
                if (emoteMap.has(word)) {
                    console.log("found emote");
                    words[index] = `<img class="emote" alt="${word}" src="${emoteMap.get(word).toLink()}">`; // replace text with image of emote
                }
            });

            return words.join(" ");
        },
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

.message-container > .message-author > img {
    transform: translateY(4px);
}

.message-author {
    color: palegreen;
    font-weight: 600;
}

.message-content {
    font-weight: 600;
}

.emote {
    transform: translateY(-4px);
    vertical-align: middle;
    max-height: 32px;
    margin-top: 2px;
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