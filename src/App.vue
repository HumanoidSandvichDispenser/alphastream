<template>
    <div id="app" @keyup.enter="this.$refs.chat.focus()">
        <div class="fullscreen">
            <YouTube @ready="$refs.youtube.playVideo()" ref="youtube" src="https://www.youtube.com/watch?v=DB6UWGeNePk"></YouTube>
        </div>
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
        <MediaController/>
    </div>
</template>

<script>
import Peer from "peerjs";
import Chat from "./components/Chat";
import MediaController from "./components/MediaController";
import sync from "css-animation-sync";
import Utils from "./utils.js";
import broadcast from "./broadcast.js";
import broadcastType from "./broadcastType";
import YouTube from "vue3-youtube";

sync("rainbow-text", {graceful: false});

const localStorage = window.localStorage;

export default {
    name: "App",
    components: {
        Chat,
        YouTube,
        MediaController,
    },
    data() {
        return {
            document: document,

            peer: {}, // Peer object
            connections: {}, // list of all connections the client has established (includes one-way connections).
            waitingFor: [], // list of all connections the client is waiting to be connected back by (list of current one-way connections).
            questions: {},

            hostID: undefined,
            hostSettings: {
                isLocked: false,
                canAdminsKick: true,
                videoUrl: "https://www.youtube.com/watch?v=DB6UWGeNePk",
                videoQueue: [

                ],
                admins: [

                ]
            },
            videoState: {
                videoTime: 0,
                isPaused: false,
                forceTimeUpdate: false,
            }
        }
    },
    computed: {
        height: () => document.innerHeight,
        width: () => document.innerWidth,
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
            this.hostID = this.peer.id;
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
        },
        addLink: function(link) {
            const videoID = Utils.videoUrlToID(link);
            console.log(videoID);
            this.$refs.youtube.loadVideoByUrl(`http://www.youtube.com/v/${videoID}?version=3`);
            //this.videoUrl = link;
            console.log("adding link " + link);
        },
        broadcastVideoState: function() {
            if (this.hostID == this.peer.id) {
                broadcast.send(this, {
                    type: broadcastType.type.videoState,
                    sender: this.peer.id,
                    body: {
                        videoState: this.videoState,
                    }
                });
            }
        },
        changeVideoState: function() {
            if (this.videoState.isPaused) {
                this.$refs.youtube.pauseVideo();
            } else {
                this.$refs.youtube.playVideo();
            }

            console.log(`${this.$refs.youtube.getCurrentTime()} video time`)
            if (Math.abs(this.$refs.youtube.getCurrentTime() - this.videoState.videoTime) > 5 ||
                this.videoState.forceTimeUpdate) { // catch video up if video is at least 5 seconds ahead or behind, or forcing a time update
                this.videoState.forceTimeUpdate = false;
                console.log("catching video up");
                this.$refs.youtube.seekTo(this.videoState.videoTime);
            }
        },
        innerWidth: () => window.innerWidth,
        innerHeight: () => window.innerHeight
    },
    mounted() {
        this.$refs.chat.clientID = this.createPeer();
        this.hostID = this.peer.id;
        console.log("Got ID: " + this.$refs.chat.clientID);

        const username = localStorage.username;
        this.$refs.chat.clientAuthor = username ? username : "Alphastreamer";

        Utils.pingClients(this); // start loop to ping clients if host
        //Utils.pingHost(this); // start loop to ping host if client
    },
};
</script>

<style>

body {
    background: black;
    margin: 0;
}

.fullscreen, .fullscreen  > * {
    position: fixed!important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%!important;
    height: 100%!important;
    border: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.ytp-expand-pause-overlay .ytp-pause-overlay {
    visibility: hidden;
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
