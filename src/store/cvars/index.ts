import { Module } from 'vuex';
import { IRootState } from '../types';
import { Cvar, ICvarState } from './types';
import { mutations } from './mutations';

const state: ICvarState = {
    client: {
        
    },
    server: {
        linkQueue: new Cvar<Array<string>>([ ]),
        timeElapsed: new Cvar<number>(0)
    },
    user: {
        username: new Cvar<string>('Alphastreamer', true)
    },
};

export const cvar: Module<ICvarState, IRootState> = {
    state,
    mutations
};
