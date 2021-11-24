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
}
</script>

<style>
:root {
    --foreground: white;
    --background: black;
    --popup-background: #282828aa;
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
