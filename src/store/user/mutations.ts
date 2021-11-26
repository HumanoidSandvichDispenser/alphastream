import { MutationTree } from 'vuex';
import { IUserState } from './types';

export const mutations: MutationTree<IUserState> = {
    SET_USERNAME(state: IUserState, payload: string) {
        state.username = payload;
    },
    SET_USERNAME_COLOR(state: IUserState, payload: string) {
        state.usernameColor = payload;
    },
}
