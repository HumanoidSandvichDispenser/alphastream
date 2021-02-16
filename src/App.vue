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
        <Chat ref="chat" :connections="connections" :hostID="hostID" @broadcast="broadcast($event.data)"
            @connect-to-peer="connectToPeer($event.id, undefined, undefined, true)" @disconnect-peers="disconnect()"/>
    </div>
</template>

<script>
import Peer from "peerjs";
import Chat from "./components/Chat";
import sync from "css-animation-sync";
import Utils from "./utils.js";

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
                    this.receive(data);
                });
            });

            return id;
        },
        connectToPeer: function(id, mergeConnections=false, connectBack=true, initialConnection=false) {
            if (this.connections[id] || id == this.peer.id) return;

            this.connections[id] = { peer: this.peer.connect(id, { serialization: "json" }) };
            this.connections[id].peer.on("open", () => {
                this.waitingFor.push(id);
                console.log("Connected to " + id);

                if (initialConnection) { // initialConnection is true if the client is connecting to the ID specified from the command
                    Utils.waitForPredicate(() => { console.log(this.waitingFor.includes(id)); return !this.waitingFor.includes(id); },
                        () => {
                            this.question("getHostID", (answer) => {this.hostID = answer; console.log("answer to question: " + answer)}, [ id ]);
                        }, 1000
                    );
                }
                if (mergeConnections) { // sends a connecting client a list of other clients they are connected to (to form a P2P circle)
                    this.broadcast({
                        type: "mergeConnections",
                        body: Object.keys(this.connections), // broadcast IDs back so clients can later connect to them
                        }, [ id ]);
                }
                if (connectBack) { // signals targets to connect back to the client
                    this.signalConnectBack(id);
                }
                const data = { // connect message
                    type: "connect",
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
            this.broadcast({
                type: "disconnect",
                sender: this.peer.id,
                body: {
                    id: this.peer.id,
                }
            });
            this.peer.disconnect();
        },
        signalConnectBack: function(id) {
            this.broadcast({
                type: "connectBack",
                sender: this.peer.id,
                }, [ id ]);
        },
        broadcast: function(data, ids=undefined) {
            if (this.peer.disconnected) {
                console.log("You have been disconnected and can not broadcast any messages.");
                return;
            }

            console.log("Broadcasting data");
            Object.keys(this.connections)
                .filter(x => ids == undefined || ids.includes(x)) // filter if ids is specified
                .forEach((id) => { this.connections[id].peer.send(data); });
        },
        receive: function(data) {
            if (data.type == "message") {
                this.$refs.chat.pushMessage(data.body.author, data.body.badge, data.body.content);
                console.log("received message: " + data.body.content);
            } else if (data.type == "connect") {
                this.$refs.chat.systemMessage(`${data.body.username} connected`);
                new Promise(resolve => setTimeout(resolve, 1))
                    .then(() => {
                        if (this.connections[data.sender]) {
                            this.connections[data.sender].username = data.body.username;
                            this.connections[data.sender].failedPings = 0;
                        }
                    });
            } else if (data.type == "disconnect") {
                this.$refs.chat.systemMessage(`${this.connections[data.sender].username} disconnected`);
                delete this.connections[data.sender]; // remove connection
            } else if (data.type == "connectBack") {
                console.log("Received connection and connecting back to " + data.sender);
                this.connectToPeer(data.sender, true, false);
            } else if (data.type == "mergeConnections") {
                console.log("Merging connection with IDS: " + data.body.join(", "));
                data.body.forEach((id) => new Promise(() => { this.connectToPeer(id) }));
            } else if (data.type == "nameChange") {
                const message = `${data.body.oldName} changed their name to ${data.body.newName}`;
                console.log(message);
                this.$refs.chat.systemMessage(message);
                this.connections[data.sender].username = data.body.newName;
            } else if (data.type == "ping") {
                const latency = new Date().getTime() - data.body.time;
                this.broadcast({
                    type: "pong",
                    sender: this.peer.id,
                    body: {
                        latency: latency
                    }
                }, data.sender);
            } else if (data.type == "pong") {
                const latency = data.body.latency; // time it took for peers to receive message
                this.$refs.chat.systemMessage(`${this.connections[data.sender].username}: ${latency} ms`);
            } else if (data.type == "question") {
                console.log("received question");
                this.broadcast({
                    type: "answer",
                    sender: this.peer.id,
                    body: {
                        question: data.body.question,
                        questionID: data.body.questionID,
                        answer: this.answer(data.sender, data.body.question),
                    },
                });
            } else if (data.type == "answer") {
                if (this.questions[data.body.questionID] == undefined) return;
                this.questions[data.body.questionID](data.body.answer);
                delete this.questions[data.body.questionID];
            } else if (data.type == "kick") {
                if (data.sender == this.hostID) {
                    this.$refs.chat.systemMessage(`Host forcefully closed connection to ${this.connections[data.body.id].username} (${data.body.reason})`);
                    delete this.connections[data.body.id];
                }
            }
        },
        question: function(questionData, task, ids, timeout=undefined, duration=2500) {
            const questionID = this.generateHex(32);
            this.broadcast({
                type: "question",
                sender: this.peer.id,
                body: {
                    questionID: questionID,
                    question: questionData,
                }
            }, ids);

            console.log("asked question");
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
                this.broadcast({
                    type: "kick",
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
