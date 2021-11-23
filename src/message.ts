export default class Message {
    public sender;

    public content: string;
    
    public get_formatted_content(): string {
        return this.content;
    }

    constructor(sender: string, content: string) {
        this.sender = sender;
        this.content = content;
    }
}
