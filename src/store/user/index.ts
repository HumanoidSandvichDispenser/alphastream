import { Module } from 'vuex';
import { IRootState } from '../types';
import { IUserState } from './types';
import { mutations } from './mutations';

const state: IUserState = {
    peer: null,
    username: 'Alphastreamer',
    usernameColor: '#FFFFFF',
    preferredPeerID: '',
};

export const user: Module<IUserState, IRootState> = {
    state,
    mutations
};
