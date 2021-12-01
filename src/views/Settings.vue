<template>
    <div class="settings-root">
        <div class="settings-section">
            <h1>Connect</h1>
            <div>
                Your peer ID: {{ peerID }}
            </div>
            <div>
                <input type="text" v-model="targetPeerID" placeholder="Peer ID">
                <button @click="$store.dispatch('CONNECT_TO_PEER', targetPeerID)">Connect</button>
            </div>
        </div>
        <div class="line-separator"/>
        <div class="settings-section">
            <h1>Settings</h1>
            <h2>Peer</h2>
            <i>You must reconnect your Peer for changes to take effect.</i>
            <div>
                <!-- Don't use v-model for this so username doesn't update every time the user enters a key. -->
                <input type="text" :value="username" @blur="blurUsernameTextbox" placeholder="Username">
            </div>
            <div>
                <input type="text" v-model="preferredPeerID" placeholder="Preferred Peer ID">
            </div>
            <div>
                <button @click="saveSettings">Save Settings</button>
                <button @click="goBack">Close</button>
            </div>
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

<style scoped>
div.line-separator {
    width: 100%;
    height: 2px;
    background-color: var(--neutral);
    opacity: 20%;
    margin-top: 16px;
    margin-bottom: 16px;
}

.settings-section > h1 {
    margin-top: 16px;
    margin-bottom: 16px;
}

input {
    background-color: var(--popup-background);
    color: var(--popup-foreground);
    border: none;
    border-radius: 4px;
}

button {
    background-color: var(--neutral);
    font-weight: 500;
    border: none;
    border-radius: 4px;
    transition-duration: 200ms;
}

button:hover {
    color: var(--foreground);
    background-color: var(--popup-background);
    transition-duration: 200ms;
}

button.accent {
    background-color: var(--accent);
}

.settings-section > * {
    margin: 8px;
}

.settings-section button, .settings-section input {
    padding: 4px 8px 4px 8px;
    margin-right: 8px;
}
</style>
