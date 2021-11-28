import Message from '@/message';
import Peer from 'peerjs';
import { ActionContext, ActionTree } from 'vuex';
import { IRootState } from '../types';
import { IDataPayload, IUserState } from './types';

export const actions: ActionTree<IUserState, IRootState> = {
    INITIALIZE_PEER(context: ActionContext<IUserState, IRootState>) {
        // create a new peer object
        context.commit('NEW_PEER_OBJECT');

        const peer = context.state.peer;
        peer.on('connection', (connection: Peer.DataConnection) => {
            connection.on('data', (data: string) => {
                // we should receive data about the user
                //peer.connect(data); // this data will eventually be replaced by an object with metadata
                context.dispatch('CONNECT_TO_PEER', data);
            });
        });
    },
    CONNECT_TO_PEER(context: ActionContext<IUserState, IRootState>, id: string) {
        if (id in context.state.connections) {
            return; // don't try to connect if we are already connected
        }

        const connection = context.state.peer.connect(id);
        if (connection) {
            context.state.connections[connection.peer] = connection;

            connection.on('error', (err) => {
                context.rootState.messages.push(new Message('System', String(err)));
            });
            connection.on('open', () => {
                context.rootState.messages.push(new Message('System', 'Connected to host.'));

                // send a message to the connected peer to also connect to us
                const signalPayload: IDataPayload = {
                    recepient: connection,
                    data: context.state.peer.id
                }

                context.dispatch('SIGNAL', signalPayload); // connection.peer is the ID we are connected to
            });
            connection.on('close', () => {
                console.log('Connection lost PepeHands');
                /*
                    if host then
                        notify all clients a specific connection has been dropped
                    else if client then
                        send system message that your connection to the host has been dropped
                    end
                */
            });
        } else {
            context.rootState.messages.push(new Message('System', 'Unable to connect.'))
        }
        //const connection = context.peer.connect(payload);
    },
    SIGNAL(context: ActionContext<IUserState, IRootState>, payload: IDataPayload) {
        payload.recepient.send(payload.data);
    },
    BROADCAST(context: ActionContext<IUserState, IRootState>, payload: IDataPayload) {
        Object.values(context.state.connections).forEach(conn => {
            conn.send(payload);
        });
    }
}
