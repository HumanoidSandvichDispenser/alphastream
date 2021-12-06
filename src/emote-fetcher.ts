import axios, { AxiosResponse } from 'axios';

interface BTTVEmote {
    id: string
    code: string
}

interface FFZEmote {
    name: string
    urls: { [size: number]: string }
}

interface FFZSet {
    emoticons: Array<FFZEmote>
}

export default class EmoteFetcher {
    public emotes: { [name: string]: string } = { };
    
    /**
     * Fetches BTTV/FFZ emotes for a given channel_id
     */
    public fetchEmotes(channel_id: number): void {
        this.fetchBTTV(channel_id);
        this.fetchFFZ(channel_id);
    }

    /**
     * Clears the emote list
     */
    public clearEmotes(): void {
        this.emotes = { };
    }

    /**
     * Fetches BTTV emotes and spreads them to `this.emotes`
     */
    public fetchBTTV(channel_id: number = undefined): void {
        let promise: Promise<AxiosResponse>;

        if (channel_id === undefined) {
            promise = axios.get('https://api.betterttv.net/3/cached/emotes/global');
        } else {
            promise = axios.get(
                `https://api.betterttv.net/3/cached/users/twitch/${channel_id}`);
        }

        promise.then((response) => {
            if (response.data instanceof Array) {
                this.spreadBTTVEmotes(response.data);
            } else {
                if ('channelEmotes' in response.data) {
                    this.spreadBTTVEmotes(response.data.channelEmotes);
                }
                if ('sharedEmotes' in response.data) {
                    this.spreadBTTVEmotes(response.data.sharedEmotes);
                }
            }
        });
    }

    /**
     * Fetches FFZ emotes and spreads them to `this.emotes`
     */
    public fetchFFZ(channel_id: number): void {
        axios.get(`https://api.frankerfacez.com/v1/room/id/${channel_id}`)
            .then((response) => {
            const set: FFZSet = <FFZSet>(Object.values(response.data.sets)[0]);
            this.spreadFFZEmotes(set.emoticons);
        });
    }

    /**
     * Adds a given list of BTTV emotes to `this.emotes`
     */
    private spreadBTTVEmotes(emotes: Array<BTTVEmote>): void {
        emotes.forEach((emote: BTTVEmote) => {
            const url = `https://cdn.betterttv.net/emote/${emote.id}/1x`;
            this.emotes[emote.code] = url;
        });
    }

    /**
     * Adds a given list of FFZ emotes to `this.emotes`
     */
    private spreadFFZEmotes(emotes: Array<FFZEmote>): void {
        emotes.forEach((emote: FFZEmote) => {
            this.emotes[emote.name] = emote.urls[1];
        });
    }
}
