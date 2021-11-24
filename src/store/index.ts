import { createStore } from 'vuex'
import EmoteFetcher from '@/emote-fetcher';

export default createStore({
    state: {
        emoteFetcher: new EmoteFetcher()
    },
    mutations: {
        
    },
    actions: {

    },
    modules: {

    }
})
