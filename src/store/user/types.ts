import Peer, { DataConnection } from 'peerjs';

export interface IDataPayload {
    recepient: DataConnection;
    data: unknown;
}

export interface IUserState {
    peer: Peer;
    connections: { [id: string]: DataConnection };
    preferences: IUserPreferences;
}

export interface IUserPreferences {
    username: string;
    usernameColor: string;
    preferredPeerID: string;
}
