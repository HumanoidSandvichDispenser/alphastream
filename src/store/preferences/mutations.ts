import { MutationTree } from 'vuex';
import { IPreferencesState } from './types';

export const mutations: MutationTree<IPreferencesState> = {
    SET_USERNAME(state: IPreferencesState, payload: string) {
        state.username = payload;
    },
    SET_USERNAME_COLOR(state: IPreferencesState, payload: string) {
        state.usernameColor = payload;
    },
    SET_PREFERRED_PEER_ID(state: IPreferencesState, payload: string) {
        state.preferredPeerID = payload;
    },
    SAVE_USER_STORE(state: IPreferencesState) {
        const json: string = JSON.stringify(state);
        localStorage.setItem('userPreferences', json);
    },
    INITIALIZE_USER_STORE(state: IPreferencesState) {
        const json = localStorage.getItem('userPreferences');

        if (json && json != '') {
            const newState = JSON.parse(json) as IPreferencesState;
            state.preferredPeerID = newState.preferredPeerID;
            state.username = newState.username;
            state.usernameColor = newState.usernameColor;
        }
    },
}
