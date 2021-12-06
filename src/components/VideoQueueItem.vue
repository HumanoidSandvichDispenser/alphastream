<template>
    <div class="video-queue-item-root">
        <div>
            <strong>{{ title }}</strong>
        </div>
        <div>
            Added by {{ addedBy }}
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        title: String,
        url: String,
        addedBy: String,
    }
})
export default class VideoQueueItem extends Vue {
    title!: string;
    url!: string;
    addedBy!: string;
}
</script>
