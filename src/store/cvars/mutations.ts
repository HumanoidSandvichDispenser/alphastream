import { MutationTree } from 'vuex';
import { ICvarState, ICvarMutationPayload } from './types';

export const mutations: MutationTree<ICvarState> = {
    SET_CVAR(state: ICvarState, payload: ICvarMutationPayload) {
        switch (payload.group) {
            case 'client':
                state.client[payload.cvar].value = payload.value;
                break;
            case 'server':
                state.server[payload.cvar].value = payload.value;
                break;
            case 'user':
                state.user[payload.cvar].value = payload.value;
                break;
        }
    }
}
