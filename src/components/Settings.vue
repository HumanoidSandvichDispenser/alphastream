<template>
    <div class="settings-root">
        <!-- Don't use v-model for this so username doesn't update every time the user enters a key. -->
        <input type="text" :value="username" @blur="blurUsernameTextbox">
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
})
export default class Settings extends Vue {
    public get username(): string {
        return this.$store.state.user.username;
    }

    public set username(name: string) {
        this.$store.commit('SET_USERNAME', name);
    }

    public blurUsernameTextbox($event: FocusEvent): void {
        let textbox = $event.target as HTMLInputElement;
        this.username = textbox.value;
    }
}
</script>
