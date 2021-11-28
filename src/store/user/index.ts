import { Module } from 'vuex';
import { IRootState } from '../types';
import { IUserState } from './types';
import { mutations } from './mutations';
import { actions } from './actions';

const state: IUserState = {
    peer: null,
    connections: { },
    preferences: {
        username: 'Alphastreamer',
        usernameColor: '#FFFFFF',
        preferredPeerID: '',
    }
};

export const user: Module<IUserState, IRootState> = {
    state,
    mutations,
    actions
};
