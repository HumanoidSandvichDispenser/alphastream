<template>
    <div id="app" @keyup.enter="this.$refs.chat.focus()">
        <iframe
            class="fullscreen"
            src="https://www.youtube.com/embed/2xHf2uKoAXY?rel=0&autoplay=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="z-index: -1"
            @keyup.enter="this.$refs.chat.focus()"
        ></iframe>
        <div class="fullscreen"></div>
        <Chat ref="chat" />
    </div>
</template>

<script>
import Chat from "./components/Chat";

export default {
    name: "App",
    components: {
        Chat,
    },
};
</script>

<style>
body {
    background: black;
    margin: 0;
}

.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

#app {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

/* width */
::-webkit-scrollbar {
    width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
    background: none;
    padding: 4px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #8881;
    border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #8ec07c;
}

span, div, input {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    color: white;
}
</style>
