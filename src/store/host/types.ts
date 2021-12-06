export interface IHostState {
    /**
     * Current timestamp of the video in seconds
     */
    videoTime: number,

    /**
     * URL of the current video being played
     */
    currentVideo: string,

    /**
     * Array of URLs in the video queue
     */
    videoQueue: Array<string>,

    /**
     * List of peers connected to the host
     */
    connections: Array<string>
}
