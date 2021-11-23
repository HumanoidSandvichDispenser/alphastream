<template>
    <div class="chat-root">
        <div class="chat-messages-container">
            <chat-message v-for="message, i in messages" :key="i" :message="message">
            </chat-message>
        </div>
        <div>
            <input type="text" @keydown="chatboxKeydown">
        </div>
    </div>
</template>

<script lang="ts">
import Message from '@/message';
import { Options, Vue } from 'vue-class-component';
import ChatMessage from '@/components/ChatMessage.vue';

@Options({
    props: {
        messages: Array
    },
    components: {
        ChatMessage
    },
})

export default class Chat extends Vue {
    messages!: Array<Message>

    chatboxKeydown($event: KeyboardEvent): void {
        if ($event.key == "Enter") {
            let element = $event.target as HTMLInputElement;
            if (element.value != "") {
                this.messages.push(new Message("pyrofromcsgo", element.value));
                element.value = ""; // clear
            }
        }
    }
}
</script>

<style>
.chat-message {
    display: inline-block;
    text-align: left;
}

.chat-message img {
    vertical-align: middle;
}
</style>
