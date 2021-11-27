import Peer from 'peerjs';
import { MutationTree } from 'vuex';
import { IUserState } from './types';

export const mutations: MutationTree<IUserState> = {
    SET_USERNAME(state: IUserState, payload: string) {
        state.username = payload;
    },
    SET_USERNAME_COLOR(state: IUserState, payload: string) {
        state.usernameColor = payload;
    },
    SET_PREFERRED_PEER_ID(state: IUserState, payload: string) {
        state.preferredPeerID = payload;
    },
    NEW_PEER_OBJECT(state: IUserState) {
        let preferredPeerID = state.preferredPeerID;

        // if our preferredPeerID is blank, temporarily make it the current UNIX timestamp
        // NOTE: an extra variable is needed so our state's preferredPeerID IS NOT MODIFIED
        if (preferredPeerID == '') {
            preferredPeerID = (new Date().getTime()).toString();
        }

        state.peer = new Peer(preferredPeerID);
        console.log(state.peer.id);
    },
    SAVE_USER_STORE(state: IUserState) {
        const json: string = JSON.stringify(state, (key, value) => {
            if (key == 'peer') {
                return undefined; // we do not want the 'peer' property to appear in the json
            }

            return value;
        });
        localStorage.setItem('user', json);
    },
    INITIALIZE_USER_STORE(state: IUserState) {
        // a json string is stored in localStorage
        const userJSON = localStorage.getItem('user');
        if (userJSON) {
            // parse json into a UserState
            const savedUser = JSON.parse(userJSON) as IUserState;

            // and assign its properties to our current state
            Object.assign(state, savedUser);
        }
    }
}
