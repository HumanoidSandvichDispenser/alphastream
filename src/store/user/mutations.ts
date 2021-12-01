import { IUserInfo } from '@/user';
import Peer, { DataConnection } from 'peerjs';
import { MutationTree } from 'vuex';
import { IUserState } from './types';

export const mutations: MutationTree<IUserState> = {
    NEW_PEER_OBJECT(state: IUserState) {
        let preferredPeerID: string = state.info.preferredPeerID;

        if (preferredPeerID == '') {
            preferredPeerID = undefined;
        }

        state.peer = new Peer(preferredPeerID);
        console.log('Your Peer ID: ' + state.peer.id);
    },
    DESTROY_PEER_OBJECT(state: IUserState) {
        state.peer.destroy();
        state.peer = undefined;
    },
    ADD_CONNECTION(state: IUserState, connection: DataConnection) {
        state.connections[connection.peer] = connection;
    },
    SET_INFO(state: IUserState, info: IUserInfo) {
        console.log(info);
        //state.info = info;
        Object.assign(state.info, info);
    }
}
