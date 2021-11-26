import Vuex, { StoreOptions } from 'vuex';
import EmoteFetcher from '@/emote-fetcher';
import { IRootState } from './types';
import { cvar } from './cvars/index';

const store: StoreOptions<IRootState> = {
    state: {
        emoteFetcher: new EmoteFetcher(),
    },
    mutations: {

    },
    actions: {

    },
    modules: {
        cvar
    }
}

export default new Vuex.Store<IRootState>(store);

/*
//import { createStore } from 'vuex';
//import Vue from 'vue';
export default createStore({
    state: {
        emoteFetcher: new EmoteFetcher(),
        settings: {
            client: {
                muted: false,
                volume: 1,
                resolution: 1, 
            },
            server: {
               linkQueue: [

               ],
               members: [
                  
               ],
               videoProgress: 0,
            },
            user: {
                name: "",
                color: "",
            }
        }
    },
    mutations: {
    },
    actions: {

    },
    modules: {

    }
})
*/
