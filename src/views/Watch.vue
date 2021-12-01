<template>
    <div class="root">
        <chat :messages="messages"/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Chat from '@/components/Chat.vue';
import Message from '@/message';

@Options({
    components: {
        Chat
    },
})
export default class Watch extends Vue {
    public get messages(): Array<Message> {
        return this.$store.state.messages;
    }
}
</script>

<style>
    
</style>
