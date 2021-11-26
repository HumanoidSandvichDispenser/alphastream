/**
 * A simple object that holds state data which may or may not persist in
 * localStorage
 */
export class Cvar<T> {
    /*
     * Value of the cvar
     */
    value: T;

    /*
     * Determines if the variable persists (saved in localStorage)
     */
    persistent: boolean;

    constructor(value: T, persistent = false) {
        this.value = value;
        this.persistent = persistent;
    }
}

/**
 * A group of cvars indexed by string (or the cvar name)
 */
interface ICvarGroup {
    [key: string]: Cvar<unknown>;
}

export interface ICvarMutationPayload {
    cvar: string;
    group: string;
    value: Record<string, unknown>;
}

export interface ICvarState {
    client: ICvarGroup;
    server: ICvarGroup;
    user: ICvarGroup;
}
