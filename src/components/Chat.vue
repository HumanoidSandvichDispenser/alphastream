<template>
    <div class="chat-root">
        <div class="chat-messages-container">
            <chat-message v-for="message, i in messages" :key="i" :message="message">
            </chat-message>
        </div>
        <div>
            <input type="text" @keydown="chatboxKeydown" :placeholder="'Send message as ' + username">
        </div>
    </div>
</template>

<script lang="ts">
import Message from '@/message';
import { Options, Vue } from 'vue-class-component';
import ChatMessage from '@/components/ChatMessage.vue';
//const { BTTVEmote, Collection, EmoteFetcher } = require("@mkody/twitch-emoticons");

@Options({
    props: {
        messages: Array
    },
    components: {
        ChatMessage
    },
    computed: {
        username(): string {
            return this.$store.state.user.preferences.username;
        }
    },
})
export default class Chat extends Vue {
    messages!: Array<Message>
    messageHistory: Array<string> = [];

    created(): void {
        this.$store.state.emoteFetcher.fetchBTTV(); // fetch global BTTV emotes
        this.$store.state.emoteFetcher.fetchEmotes(71092938); // xQcOW
        this.$store.state.emoteFetcher.fetchEmotes(22484632); // forsen
    }

    /**
     * Fired whenever a key is depressed on the chatbox
     */
    chatboxKeydown($event: KeyboardEvent): void {
        if ($event.key == 'Enter') {
            let element = $event.target as HTMLInputElement;
            if (element.value && element.value != '') {
                let message = this.insertEmotes(this.escapeHTML(element.value));
                if (message.startsWith('$')) {
                    // TODO: Add commands
                    // This is just temporary.
                    let newUsername = message.substring(1); // gets the message after the '$'
                    this.$store.commit('SET_USERNAME', newUsername);
                } else {
                    let username: string = this.$store.state.user.preferences.username;
                    this.messages.push(new Message(username, message));
                }
                element.value = ''; // clear textbox
            }
        }
    }

    /**
     * Escapes HTML code in messages to prevent HTML injection and XSS.
     */
    escapeHTML(unsafe: string): string {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Inserts emote images into the inner HTML of a message.
     */
    insertEmotes(message: string): string {
        const words = message.split(' ');
        words.forEach((word, i) => {
            if (word in this.$store.state.emoteFetcher.emotes) {
                const url = this.$store.state.emoteFetcher.emotes[word];
                words[i] = `<img src="${url}" alt="${word}" title="${word}">`
            }
        });
        return words.join(' ');
    }
}
</script>

<style>
.chat-root {
    position: absolute;
    background-color: var(--popup-background);
    border-radius: 8px;
    bottom: 16px;
    padding: 16px;
}

.chat-root .chat-messages-container {
    overflow-y: scroll;
    height: 50vh;
    width: 40vw;
}

.chat-root input {
    width: 100%;
    outline: none;
    border: none;
    color: var(--foreground);
    background: transparent;
    font-size: 16px;
}
</style>
