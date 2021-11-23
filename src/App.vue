<template>
    <chat :messages="messages"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Chat from './components/Chat.vue';
import Message from './message';

@Options({
    components: {
        Chat,
    },
})
export default class App extends Vue {
    messages: Array<Message> = [];

    created(): void {
        this.messages.push(new Message("xQcOW", "bruhhh these litty memes lmfaooo 😂😂"));
        this.messages.push(new Message("forsen", "I HECKIN LOVE AMONG US!!!"));
        this.messages.push(new Message("gawr gura", "Good fucking morning Bajs <img src=\"https://static-cdn.jtvnw.net/emoticons/v2/521050/static/light/3.0\" width=\"28\"> not forsen btw Copesen"));
        this.messages.push(new Message("forsen", "I HECKIN LOVE AMONG US!!!"));
        this.messages.push(new Message("forsen", "I HECKIN LOVE AMONG US!!!"));
        this.messages.push(new Message("forsen", "I HECKIN LOVE AMONG US!!!"));
        this.messages.push(new Message("forsen", "I HECKIN LOVE AMONG US!!!"));
    }
}
</script>

<style>
:root {
    --foreground: white;
    --background: #212121;
    --popup-background: #ddddddaa;
}

body {
    background-color: var(--background);
    color: var(--foreground);
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 16px;
}
</style>
