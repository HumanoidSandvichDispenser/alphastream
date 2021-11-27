import Peer from 'peerjs';

export interface IUserState {
    peer: Peer;
    username: string;
    usernameColor: string;
    preferredPeerID: string;
}
