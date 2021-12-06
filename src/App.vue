<template>
    <div id="nav">
        <div>
            <router-link to="/">
                <img src="@/assets/vue-logo-white.png" height="48">
            </router-link>
            <router-link to="/watch">
                <img src="@/assets/vue-logo-white.png" height="48">
            </router-link>
        </div>
    </div>
    <div id="content">
        <router-view/>
    </div>
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
    public isNavClosed = false;

    public beforeCreate(): void {
        // this loads the settings from localStorage into the preferences store
        this.$store.commit('INITIALIZE_PREFERENCES_STORE');
    }
}
</script>

<style>
:root {
    --foreground: #eceff4;
    --background: #2e3440;
    --popup-foreground: #e5e9f0;
    --popup-background: #4c566aaa;
    --neutral: #a4a0a0;
    --accent: #40dd8b;
}

body {
    background-color: var(--background);
    color: var(--foreground);
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*margin: 16px;*/
    display: flex;
}

#nav {
    display: block;
    width: 64px;
    height: 100vh;
    background-color: var(--popup-background);
    color: var(--popup-foreground);
}

#nav.closed {
    width: 0;
    transition-duration: 200ms;
}

#nav a {
    display: block;
    height: 64px;
    text-decoration-line: none;
}

#nav a > img {
    opacity: 0.5;
    padding: 8px;
}

#nav a.router-link-active > img {
    opacity: 1;
}

#content {
    flex-grow: 1;
}
</style>
