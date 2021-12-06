import { Module } from 'vuex';
import { IRootState } from '../types';
import { IPreferencesState } from './types';
import { mutations } from './mutations';
import { actions } from './actions';

const state: IPreferencesState = {
    username: 'Alphastreamer',
    usernameColor: '#FFFFFF',
    preferredPeerID: '',
    showEmotes: true,
    emoteList: [
        71092938,
        22484632
    ]
};

export const preferences: Module<IPreferencesState, IRootState> = {
    state,
    mutations,
    actions
};
