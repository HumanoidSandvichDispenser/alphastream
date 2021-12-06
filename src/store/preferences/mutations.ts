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
    SET_SHOW_EMOTES(state: IPreferencesState, value: boolean) {
        state.showEmotes = value;
    },
    SAVE_USER_STORE(state: IPreferencesState) {
        const json: string = JSON.stringify(state);
        localStorage.setItem('userPreferences', json);
    },
    INITIALIZE_PREFERENCES_STORE(state: IPreferencesState) {
        const json = localStorage.getItem('userPreferences');

        if (json && json != '') {
            const newState = JSON.parse(json) as IPreferencesState;
            Object.assign(state, newState);
            /*
            state.preferredPeerID = newState.preferredPeerID;
            state.username = newState.username;
            state.usernameColor = newState.usernameColor;
            state.showEmotes = newState.showEmotes;
            */
        }
    },
}
