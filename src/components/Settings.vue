<template>
    <div class="settings-root">
        <!-- Don't use v-model for this so username doesn't update every time the user enters a key. -->
        <span>Your peer ID: {{ peerID }}</span>
        <br>
        <input type="text" :value="username" @blur="blurUsernameTextbox" placeholder="Username">
        <br>
        <input type="text" :value="preferredPeerID" @blur="blurPeerIDTextbox" placeholder="Preferred Peer ID">
        <span>You must restart Alphastream after changing your preferred Peer ID.</span>
        <button @click="saveSettings">Save Settings</button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
})
export default class Settings extends Vue {
    public created(): void {
        // create a new peer object
        this.$store.commit('NEW_PEER_OBJECT');
    }

    public get username(): string {
        return this.$store.state.user.username;
    }

    public set username(name: string) {
        this.$store.commit('SET_USERNAME', name);
    }

    public get preferredPeerID(): string {
        return this.$store.state.user.preferredPeerID;
    }

    public set preferredPeerID(id: string) {
        this.$store.commit('SET_PREFERRED_PEER_ID', id);
    }

    public get peerID(): string {
        if (this.$store.state.user.peer) {
            return this.$store.state.user.peer.id;
        }
        return 'No Peer ID given yet';
    }

    public blurUsernameTextbox($event: FocusEvent): void {
        let textbox = $event.target as HTMLInputElement;
        this.username = textbox.value;
    }

    public blurPeerIDTextbox($event: FocusEvent): void {
        let textbox = $event.target as HTMLInputElement;
        this.preferredPeerID = textbox.value;
    }

    public saveSettings(): void {
        this.$store.commit('SAVE_USER_STORE');
    }
}
</script>
