<template>
    <div id="nav">
        <!--router-link to="/">Watch</router-link-->
        <router-link to="/settings">Settings</router-link>
    </div>
    <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Settings from '@/views/Settings.vue';

@Options({
    components: {
        Settings
    },
})
export default class App extends Vue {
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
