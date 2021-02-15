<template>
    <div ref="popupContainer" class="popup-container">
        <div ref="messageListContainer" class="message-list-container">
            <ul>
                <Message ref="infoMessage" author="System" :content="`${clientAuthor} (PeerID ${clientID})`"/>
                <Message v-for="(message, index) in messages" :key="index" :author="message.author" :badge="message.badge" :content="message.content"/>
            </ul>
        </div>
        <input ref="messageBox" placeholder="Message or link" @keyup.enter="onEnter($event)">
    </div>
</template>

<script>
import Message from "./Message";

export default {
    components: {
        Message,
    },
    data() {
        return {
            isFocused: false,
            clientAuthor: "MODERATOR STANCE",
            clientColor: "#ff4a50",
            clientBadge: undefined,
            clientID: undefined,
            messages: [],

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

            scope.$refs.messageListContainer.scrollTop = scope.$refs.messageListContainer.scrollHeight;

            scope.isFocused = !scope.isFocused;
        },
        onEnter: function(e) {
            const text = e.target.value;

            if (text.startsWith("!#")) {
                const message = this.parseCommand((text.match(/('.*?'|".*?"|\S+)/g)));
                this.systemMessage(message);
            } else if (/\S/.test(text)) {
                this.pushMessage(this.clientAuthor, this.clientBadge, text);
                this.$emit("broadcast", { data: this.stringifyMsgData(this.clientAuthor, this.clientBadge, text) })
            }

            e.target.value = "";
        },
        pushMessage: function(author, badge, text) {
            this.messages.push({
                author: author,
                badge: badge,
                content: text
            });

            this.$refs.infoMessage.syncAnimations(); // infoMessage is a single message containing info, and the chat will always contain this message.
        },
        systemMessage: function(text) {
            this.pushMessage("System", undefined, text);
        },
        parseCommand: function(args) {
            switch (args[0]) {
                case "!#connect": {
                    if (args.length < 2) return this.assertArgCount(args, 1);
                    this.$emit("connect-to-peer", { id: args[1] });
                    return `Connecting to ${args[1]}...`;
                }
                case "!#setname": {
                    if (args.length < 2) return this.assertArgCount(args, 1);
                    const oldName = this.clientAuthor;
                    this.clientAuthor = args[1];
                    return `Changed name from ${oldName} to ${args[1]}`;
                }
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
    },
    mounted() {
        const _this = this;

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