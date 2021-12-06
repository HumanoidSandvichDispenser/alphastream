import { Module } from 'vuex';
import { IRootState } from '../types';
import { IHostState } from './types';
import { mutations } from './mutations';

const state: IHostState = {
    videoTime: -1,
    currentVideo: '',
    videoQueue: [ ],
    connections: [ ]
};

export const host: Module<IHostState, IRootState> = {
    state,
    mutations
};
