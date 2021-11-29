import Message from '@/message';
import { ActionContext, ActionTree } from 'vuex';
import { IRootState } from '../types';
import { DataPayloadType, IDataChatMessage, IDataConnectBack, IDataPayload, IUserState } from './types';

export const actions: ActionTree<IUserState, IRootState> = {
    INITIALIZE_PEER(context: ActionContext<IUserState, IRootState>) {
        context.commit('NEW_PEER_OBJECT');

        context.state.peer.on('connection', connection => {
            console.log('Received connection from ' + connection.peer);
            context.dispatch('CONNECT_TO_PEER', connection.peer); // connection.peer is the peer ID
            context.state.connections[connection.peer] = connection;
            
            connection.on('data', (data: IDataPayload) => {
                switch (data.type) {
                    case DataPayloadType.ChatMessage: {
                        const dataChatMessage: IDataChatMessage = data as IDataChatMessage;
                        context.commit('PUSH_MESSAGE', new Message(
                            connection.metadata.info.username, dataChatMessage.message));
                        break;
                    } case DataPayloadType.ConnectBack: {
                        const dataConnectBack: IDataConnectBack = data as IDataConnectBack;
                        dataConnectBack.ids.forEach((id) => {
                            context.dispatch('CONNECT_TO_PEER', id);
                        });
                        break;
                    }
                }
            });
        });
    },
    CONNECT_TO_PEER(context: ActionContext<IUserState, IRootState>, id: string) {
        if (context.state.connections[id] !== undefined) {
            console.log('We are already connected to this peer. Skipping...');
            return; // we are already connected to this peer!
        }

        const connection = context.state.peer.connect(id, {
            metadata: {
                info: context.state.info
            }
        });
        console.log('Attempting to connect to ' + id);

        if (connection) {
            connection.on('open', () => {
                context.state.connections[id] = connection;
                console.log('Connected to ' + id);
                // TODO: implement
            });
            connection.on('close', () => {
                delete context.state.connections[connection.peer];
            });
        } else {
            context.commit('PUSH_MESSAGE', new Message('System', 'Unable to connect to host.'));
        }
    },
    SIGNAL(context: ActionContext<IUserState, IRootState>, payload: IDataPayload) {
        payload.recepient.send(payload);
    },
    BROADCAST(context: ActionContext<IUserState, IRootState>, payload: IDataPayload) {
        Object.values(context.state.connections).forEach(conn => {
            conn.send(payload);
        });
    },
    SEND_MESSAGE(context: ActionContext<IUserState, IRootState>, payload: IDataChatMessage) {
        Object.values(context.state.connections).forEach(conn => {
            conn.send(payload);
        });
    }
}
