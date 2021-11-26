import { Module } from 'vuex';
import { IRootState } from '../types';
import { IUserState } from './types';
import { mutations } from './mutations';

const state: IUserState = {
    username: 'Alphastreamer',
    usernameColor: '#FFFFFF'
};

export const user: Module<IUserState, IRootState> = {
    state,
    mutations
};
