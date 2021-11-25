import { createStore } from 'vuex'
import EmoteFetcher from '@/emote-fetcher';

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
