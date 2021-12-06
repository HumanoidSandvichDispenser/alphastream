import { Module } from 'vuex';
import { IRootState } from '../types';
import { IUserState } from './types';
import { mutations } from './mutations';
import { actions } from './actions';

const state: IUserState = {
    peer: null,
    connections: { },
    info: {
        username: '',
        usernameColor: '',
        preferredPeerID: '',
        showEmotes: true,
        emoteList: [ ]
    },
    isHost: false,
    get isConnected(): boolean {
        if (this.peer) {
            return !this.peer.disconnected;
        }
        return false;
    }
};

export const user: Module<IUserState, IRootState> = {
    state,
    mutations,
    actions
};
