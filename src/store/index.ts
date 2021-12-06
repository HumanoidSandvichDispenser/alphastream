import { createStore, StoreOptions } from 'vuex';
import EmoteFetcher from '@/emote-fetcher';
import { IRootState } from './types';
import { user } from './user/index';
import { preferences } from './preferences';
import Message from '@/message';

export default createStore({
    state: {
        emoteFetcher: new EmoteFetcher(),
        messages: []
    },
    mutations: {
        PUSH_MESSAGE(state: IRootState, message: Message) {
            state.messages.push(message);
        },
        CONCAT_MESSAGES(state: IRootState, messages: Array<Message>) {
            state.messages.concat(messages);
        },
    },
    actions: {
    },
    modules: {
        user,
        preferences
    }
} as StoreOptions<IRootState>);
