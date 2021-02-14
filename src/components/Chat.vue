<template>
    <div ref="popupContainer" class="popup-container">
        <div class="message-list-container">
            <ul>
                <Message author="System">{{ clientAuthor }} (PeerID {{ clientID }})</Message>
                <Message v-for="(message, index) in messages" :key="index" :author="message.author" :badge="message.badge">
                    {{ message.content }}
                </Message>
            </ul>
        </div>
        <input ref="messageBox" placeholder="Message or link" @keyup.enter="onEnter($event)">
    </div>
</template>

<script>
import Peer from "peerjs";
import Message from "./Message";

var peer, connection = undefined;

export default {
    components: {
        Message,
    },
    data() {
        return {
            isFocused: false,
            clientAuthor: undefined,
            clientColor: "#ff4a50",
            clientBadge: undefined,
            clientID: undefined,
            messages: [],

            peer: {}, // object
            connections: {},
        }
    },
    methods: {
        focus: function(scope) {
            const popupContainer = scope.$refs.popupContainer;

            if (scope.isFocused) {
                popupContainer.classList.remove("focused");
            } else {
                popupContainer.classList.add("focused");
                scope.$refs.messageBox.focus();
            }

            scope.isFocused = !scope.isFocused;
        },
        onEnter: function(e) {
            const text = e.target.value;

            if (text.startsWith("!#")) {
                const message = this.parseCommand((text.match(/('.*?'|".*?"|\S+)/g)));
                this.systemMessage(message);
            } else if (/\S/.test(text)) {
                this.pushMessage(this.clientAuthor, this.clientBadge, text);

                if (connection != undefined) {
                    connection.send( this.stringifyMsgData(
                        this.clientAuthor, this.clientBadge, text));
                }
            }

            e.target.value = "";
        },
        pushMessage: function(author, badge, text) {
            this.messages.push({
                author: author,
                badge: badge,
                content: text
            });
        },
        systemMessage: function(text) {
            this.pushMessage("System", undefined, text);
        },
        parseCommand: function(args) {
            switch (args[0]) {
                case "!#connect":
                    if (args.length < 2) return this.assertArgCount(args, 1);
                    connection = peer.connect(args[1]);
                    connection.on("open", () => {
                        const data = JSON.stringify({
                            type: "message",
                            body: {
                                author: "System",
                                badge: undefined,
                                content: `${this.clientAuthor} has joined`,
                            }
                        });

                        connection.send(data);
                    });
                    break;
                case "!#setname":
                    if (args.length < 2) return this.assertArgCount(args, 1);
                    this.clientAuthor = args[1];
                    break;
                default:
                    return `Unknown command ${args[0]}`;
            }
        },
        stringifyMsgData: function(author, badge, content) {
            return JSON.stringify({
                type: "message",
                body: {
                    author: author,
                    badge: badge,
                    content: content
                }
            })
        },
        assertArgCount: function(args, length) {
            return `${args[0]} expected ${length} arguments (got ${args.length - 1})`;
        },
        generateHex: function(length) {
            return [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        },

        // P2P CONNECTIONS

        createPeer: function() {
            this.peer = new Peer("ASTREAM_" + this.generateHex(16));

            peer.on("connection", (conn) => {
                if (!this.connections[conn.peer.id]) {
                    this.configureConnection(conn);
                }

                conn.on("data", (data) => {
                    data = JSON.parse(data);

                    if (data.type == "message") {
                        this.pushMessage(data.body.author, data.body.badge, data.body.content);
                    }
                });
            });
        },
        connectToPeer: function() {
            
        },
        configureConnection: function(conn) {
            conn.on("data")
        }
    },
    mounted() {
        const _this = this;

        this.createPeer();

        this.clientID = peer.id;

        document.onkeyup = function(e) {
            if (e.key == "Enter") {
                _this.focus(_this);
            }
        }
    },
}
</script>

<style>
.popup-container {
    position: fixed;
    bottom: 48px;
    left: 48px;
    float: left;
    vertical-align: bottom;
    background-color: transparent;
    height: 300px;
    width: 400px;
    border-radius: 4px;
    transition-duration: 200ms;
}

.popup-container.focused {
    background-color: #282828ee;
    transition-duration: 400ms;
}

.popup-container.focused input {
    visibility: visible;
    color: white;
}

.message-list-container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 252px;
}

.popup-container ul {
    padding: 0;
}

.popup-container input {
    visibility: hidden;
    position: absolute;
    display: block;
    background-color: transparent;
    color: transparent;
    border: none;
    outline: none;
    bottom: 0;
    left: 0;
    float: left;
    margin: 8px;
    padding: 8px;
    width: 368px;
    font-size: 16px;
    word-wrap: break-word;
}
</style>