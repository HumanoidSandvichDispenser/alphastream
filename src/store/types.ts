import EmoteFetcher from '@/emote-fetcher';
import Message from '@/message';

export interface IRootState {
    emoteFetcher: EmoteFetcher
    messages: Array<Message>
}
