<template>
    <div class="settings-root">
        <div>
            <span>Your peer ID: {{ peerID }}</span>
        </div>
        <div>
            <!-- Don't use v-model for this so username doesn't update every time the user enters a key. -->
            <input type="text" :value="username" @blur="blurUsernameTextbox" placeholder="Username">
        </div>
        <div>
            <input type="text" v-model="preferredPeerID" placeholder="Preferred Peer ID">
            <span>You must restart Alphastream after changing your preferred Peer ID.</span>
        </div>
        <div>
            <input type="text" v-model="targetPeerID" placeholder="Peer ID">
            <button @click="$store.dispatch('CONNECT_TO_PEER', targetPeerID)">Connect</button>
        </div>
        <div>
            <button @click="saveSettings">Save Settings</button>
            <button @click="goBack">Close</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
})
export default class Settings extends Vue {
    public get username(): string {
        return this.$store.state.preferences.username;
    }

    public set username(name: string) {
        this.$store.commit('SET_USERNAME', name);
    }

    public get preferredPeerID(): string {
        return this.$store.state.preferences.preferredPeerID;
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

    public saveSettings(): void {
        this.$store.commit('SAVE_USER_STORE');
    }

    public goBack(): void {
        this.$router.go(-1);
    }

    public data(): Record<string, unknown> {
        return {
            targetPeerID: ''
        }
    }

    /*
     * The PeerID of the user you would like to connect to.
     */
    //public targetPeerID: string;
}
</script>
