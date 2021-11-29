import { IUserInfo } from '@/user';
import Peer, { DataConnection } from 'peerjs';

export enum DataPayloadType {
    Invalid,
    ConnectBack,
    ChatMessage
}

export interface IDataConnectBack extends IDataPayload {
    type: DataPayloadType.ConnectBack;
    ids: Array<string>;
}

export interface IDataChatMessage extends IDataPayload {
    type: DataPayloadType.ChatMessage;
    message: string;
}

export interface IDataPayload {
    type: DataPayloadType,
    recepient: DataConnection;
}

export interface IUserState {
    info: IUserInfo;
    peer: Peer;
    connections: { [id: string]: DataConnection };
    isHost: boolean;
}
