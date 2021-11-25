export default class Message {
    public sender;

    public content: string;

    constructor(sender: string, content: string) {
        this.sender = sender;
        this.content = content;
    }
}
