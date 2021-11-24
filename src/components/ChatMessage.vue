<template>
    <div class="chat-message">
        <strong style="margin-right: 1em;">{{ message.sender }}</strong>
        <span v-html="message.content"></span>
    </div>
    <br>
</template>

<script lang="ts">
import Message from '@/message';
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        message: Message
    },
})

export default class Chat extends Vue {
    message!: Message
}
</script>

<style>
.chat-message {
    display: inline-block;
    text-align: left;
    font-size: 16px;
    min-height: 32px;
}

.chat-message img {
    vertical-align: middle;
}
</style>
