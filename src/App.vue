<template>
    <div id="app" @keyup.enter="this.$refs.chat.focus()">
        <div id="player"></div>
        <!--iframe
            class="fullscreen"
            src="https://www.youtube.com/embed/2xHf2uKoAXY?rel=0&autoplay=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="z-index: -1"
            @keyup.enter="this.$refs.chat.focus()"
        ></iframe-->
        <div class="fullscreen"></div>
        <Chat ref="chat" :connections="connections" :hostID="hostID" @broadcast="onBroadcast($event.data)"
            @connect-to-peer="connectToPeer($event.id, undefined, undefined, true)" @disconnect-peers="disconnect()" @reconnect="this.peer.reconnect()"/>
    </div>
</template>

<script>
import Peer from "peerjs";
import Chat from "./components/Chat";
import sync from "css-animation-sync";
import Utils from "./utils.js";
import broadcast from "./broadcast.js";
import broadcastType from "./broadcastType";

sync("rainbow-text", {graceful: false});

const localStorage = window.localStorage;

export default {
    name: "App",
    components: {
        Chat,
    },
    data() {
        return {
            peer: {}, // Peer object
            connections: {}, // list of all connections the client has established (includes one-way connections).
            waitingFor: [], // list of all connections the client is waiting to be connected back by (list of current one-way connections).
            questions: {},

            hostID: undefined,
            hostSettings: {
                isLocked: false,
                canAdminsKick: true,
                queue: [

                ],
                admins: [

                ]
            },
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
                Utils.removeElement(this.waitingFor, conn.peer); // no longer waiting for target to connect back

                conn.on("data", (data) => {
                    broadcast.receive(this, data);
                });
            });

            return id;
        },
        connectToPeer: function(id, mergeConnections=false, connectBack=true, initialConnection=false) {
            if (this.connections[id] || id == this.peer.id) return;

            if (this.peer.disconnected) {
                this.$refs.chat.systemMessage("You have disconnected. Type !#reconnect to connect back to the PeerServer");
                return;
            }

            this.connections[id] = { peer: this.peer.connect(id, { serialization: "json" }) };
            this.connections[id].peer.on("open", () => {
                this.waitingFor.push(id);
                console.log("Connected to " + id);

                if (initialConnection) { // initialConnection is true if the client is connecting to the ID specified from the command
                    Utils.waitForPredicate(() => { return !this.waitingFor.includes(id); },
                        () => {
                            console.log("getting host ID...");
                            this.question("getHostID", (answer) => {this.hostID = answer; console.log("answer to question: " + answer)}, [ id ]);
                        }, 1000
                    );
                }
                if (mergeConnections) { // sends a connecting client a list of other clients they are connected to (to form a P2P circle)
                    broadcast.send(this, {
                        type: broadcastType.type.mergeConnections,
                        body: Object.keys(this.connections), // broadcast IDs back so clients can later connect to them
                        }, [ id ]);
                }
                if (connectBack) { // signals targets to connect back to the client
                    this.signalConnectBack(id);
                }
                const data = { // connect message
                    type: broadcastType.type.connect,
                    sender: this.peer.id,
                    body: {
                        id: this.peer.id,
                        username: this.$refs.chat.clientAuthor,
                    }
                };
                this.connections[id].peer.send(data);
            });
        },
        disconnect: function() {
            broadcast.send(this, {
                type: broadcastType.type.disconnect,
                sender: this.peer.id,
                body: {
                    id: this.peer.id,
                }
            });
            Object.keys(this.connections).forEach(id => {
                if (this.connections[id]) {
                    this.connections[id].peer.close();
                }
            });
            this.connections = {};
        },
        signalConnectBack: function(id) {
            broadcast.send(this, {
                type: broadcastType.type.connectBack,
                sender: this.peer.id,
                }, [ id ]);
        },
        onBroadcast: function(data) {
            broadcast.send(this, data);
        },
        
        question: function(questionData, task, ids, timeout=undefined, duration=2500) {
            console.log("asking question");
            const questionID = this.generateHex(32);
            broadcast.send(this, {
                type: broadcastType.type.question,
                sender: this.peer.id,
                body: {
                    questionID: questionID,
                    question: questionData,
                }
            }, ids);

            this.questions[questionID] = task;

            setTimeout(() => {
                if (this.questions[questionID] != undefined && timeout != undefined) // question has not been answered
                    timeout(); // invoke timeout method
            }, duration);
        },
        answer: function(sender, question) {
            console.log("answering question " + question);
            switch (question) {
                case "getHostID": return this.hostID;
                case "ping": return this.peer.id;
            }
        },
        kick: function(id, reason) {
            if (this.hostID == this.peer.id) {
                broadcast.send(this, {
                    type: broadcastType.type.kick,
                    sender: this.peer.id,
                    body: {
                        id: id,
                        reason: reason,
                    }
                })
            }

            this.$refs.chat.systemMessage(`Host forcefully closed connection to ${this.connections[id].username} (${reason})`);
            delete this.connections[id];
        }
    },
    mounted() {
        this.$refs.chat.clientID = this.createPeer();
        this.hostID = this.peer.id;
        console.log("Got ID: " + this.$refs.chat.clientID);

        const username = localStorage.username;
        this.$refs.chat.clientAuthor = username ? username : "Alphastreamer";

        Utils.pingClients(this); // start loop to ping clients if host
        Utils.pingHost(this); // start loop to ping host if client
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
