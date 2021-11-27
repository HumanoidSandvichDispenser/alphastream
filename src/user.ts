import { IUserState } from '@/store/user/types';
import Peer from 'peerjs';

export default class User implements IUserState {
    public peer: Peer;

    public usernameColor: string;

    public username: string;

    public preferredPeerID: string;

    constructor() {
        return;
    }
}
