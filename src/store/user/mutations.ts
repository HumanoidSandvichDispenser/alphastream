import Peer from 'peerjs';
import { MutationTree } from 'vuex';
import { IUserPreferences, IUserState } from './types';

export const mutations: MutationTree<IUserState> = {
    SET_USERNAME(state: IUserState, payload: string) {
        state.preferences.username = payload;
    },
    SET_USERNAME_COLOR(state: IUserState, payload: string) {
        state.preferences.usernameColor = payload;
    },
    SET_PREFERRED_PEER_ID(state: IUserState, payload: string) {
        state.preferences.preferredPeerID = payload;
    },
    NEW_PEER_OBJECT(state: IUserState) {
        let preferredPeerID = state.preferences.preferredPeerID;

        // if our preferredPeerID is blank, temporarily make it the current UNIX timestamp
        // NOTE: an extra variable is needed so our state's preferredPeerID IS NOT MODIFIED
        if (preferredPeerID == '') {
            preferredPeerID = (new Date().getTime()).toString();
        }

        state.peer = new Peer(preferredPeerID);
        console.log(state.peer.id);
    },
    SAVE_USER_STORE(state: IUserState) {
        /*
        const json: string = JSON.stringify(state, (key, value) => {
            switch (key) {
                // we do not want these properties to appear in the json
                case 'peer':
                case 'isHost':
                    return undefined;
                default:
                    return value;
            }
        });
        */
        const json: string = JSON.stringify(state.preferences);
        localStorage.setItem('userPreferences', json);
    },
    INITIALIZE_USER_STORE(state: IUserState) {
        // a json string is stored in localStorage
        const userJSON = localStorage.getItem('userPreferences');
        if (userJSON) {
            // parse json into a UserState
            const savedUser = JSON.parse(userJSON) as IUserPreferences;

            // and assign its properties to our current state
            Object.assign(state.preferences, savedUser);
        }
    },
}
