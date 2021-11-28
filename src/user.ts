import { IUserPreferences, IUserState } from '@/store/user/types';
import Peer, { DataConnection } from 'peerjs';

export default class User implements IUserState {
    public peer: Peer;

    public isHost: boolean;

    public connections: Array<DataConnection>;

    public preferences: IUserPreferences;
}
