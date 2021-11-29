<template>
    <settings/>
    <chat :messages="messages"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Chat from '@/components/Chat.vue';
import Settings from '@/components/Settings.vue'
import Message from '@/message';

@Options({
    components: {
        Chat,
        Settings
    },
})
export default class App extends Vue {
    messages: Array<Message> = [];

    public beforeCreate(): void {
        // this loads the settings from localStorage into the store
        this.$store.commit('INITIALIZE_USER_STORE');
    }
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
