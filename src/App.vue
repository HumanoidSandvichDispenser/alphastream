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
        <Chat ref="chat" @broadcast="broadcast($event.data)" @connect-to-peer="connectToPeer($event.id)"/>
    </div>
</template>

<script>
import Peer from "peerjs";
import Chat from "./components/Chat";
import sync from "css-animation-sync";

sync("rainbow-text", {graceful: false});

export default {
    name: "App",
    components: {
        Chat,
    },
    data() {
        return {
            peer: {}, // object
            connections: {},
        }
    },
    methods: {
        generateHex: function(length) {
            return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        },
        createPeer: function() {
            const id = "ASTREAM_" + this.generateHex(16);
            this.peer = new Peer(id);

            this.peer.on("connection", (conn) => {
                conn.on("data", (data) => {
                    this.receive(data);
                });
            });

            return id;
        },
        connectToPeer: function(id, mergeConnections=false, connectBack=true) {
            if (this.connections[id] || id == this.peer.id) return;

            this.connections[id] = this.peer.connect(id);
            this.connections[id].on("open", () => {
                console.log("Connected to " + id);

                const data = JSON.stringify({
                    type: "message",
                    body: {
                        author: "System",
                        badge: undefined,
                        content: `${this.$refs.chat.clientAuthor} has joined`,
                    }
                });
                this.connections[id].send(data);
                
                if (mergeConnections) {
                    this.broadcast(JSON.stringify({
                        type: "mergeConnections",
                        body: Object.keys(this.connections), // broadcast IDs back so clients can later connect to them
                    }), [ id ]);
                }
                if (connectBack) {
                    this.signalConnectBack(id);
                }
            });
        },
        configureConnection: function(conn) {
            conn.on("data")
        },
        signalConnectBack: function(id) {
            this.broadcast(JSON.stringify({
                type: "connectBack",
                body: this.peer.id,
            }), [ id ])
        },
        broadcast: function(data, ids=undefined) {
            console.log("Broadcasting data");
            Object.keys(this.connections)
                .filter(x => ids == undefined || ids.includes(x)) // filter if ids is specified
                .forEach((id) => { this.connections[id].send(data); });
        },
        receive: function(data) {
            data = JSON.parse(data);

            if (data.type == "message") {
                this.$refs.chat.pushMessage(data.body.author, data.body.badge, data.body.content);
                console.log("received message: " + data.body.content);

            } else if (data.type == "connectBack") {
                console.log("Received connection and connecting back to " + data.body);
                this.connectToPeer(data.body, true, false);
            } else if (data.type == "mergeConnections") {
                console.log("Merging connection with IDS: " + data.body.join(", "));
                data.body.forEach((id) => this.connectToPeer(id));
            } else if (data.type == "nameChange") {
                console.log(`${data.body.oldName} changed their name to ${data.body.newName}`);
            }
        }
    },
    mounted() {
        this.$refs.chat.clientID = this.createPeer();
        console.log("Got ID: " + this.$refs.chat.clientID);
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
