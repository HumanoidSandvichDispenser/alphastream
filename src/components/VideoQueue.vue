<template>
    <div class="video-queue-root">
        <video-queue-item v-for="i, video in videos" :key="i"
            :title="video.title" :url="video.url" :added-by="video.addedBy"/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import VideoQueueItem from '@/components/VideoQueueItem.vue';

@Options({
    components: {
        VideoQueueItem
    }
})
export default class VideoQueue extends Vue {
    public get videos(): unknown {
        return this.$store.state.host.videos;
    }
}
</script>
