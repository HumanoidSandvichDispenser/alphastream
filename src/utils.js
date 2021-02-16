export default {
    waitForPredicate: function(predicate, callback, delay=0, timeout=10000, elapsed=0, epoch=0) {
        if (epoch == 0) {
            epoch = new Date().getTime();
        } else {
            elapsed = epoch - new Date().getTime();
        }
        if (predicate()) {
            console.log("invoking callback in " + delay);
            setTimeout(callback, delay);
        } else if (elapsed < timeout) {
            setTimeout(() => this.waitForPredicate(predicate, callback, delay, timeout, elapsed, epoch), 100);
        }
    },
    removeElement: function(arr, el) {
        const index = arr.indexOf(el);

        if (index > -1) {
            arr.splice(index, 1);
            return true;
        }

        return false;
    },
    pingClients: function(app) {
        setTimeout(() => this.pingClients(app), 2000);

        if (app.hostID != app.peer.id)

        Object.keys(app.connections).forEach((id) => {
            if (!app.connections[id]) return;

            app.question("ping",
                () => { // on successful answer
                    if (!app.connections[id]) return;
                    console.log("successfully received ping");
                    app.connections[id].failedPings = 0;
                },
                id,
                () => { // on timeout (no response)
                    if (!app.connections[id]) return;
                    if (++app.connections[id].failedPings >= 4) {
                        console.log(id + " has timed out");
                        app.kick(id, "timed out");
                    }
                }
            );
        });
    },
    pingHost: function(app) {
        setTimeout(() => this.pingHost(app), 4000);

        if (app.hostID == app.peer.id || app.peer.disconnected) return;

        if (!app.connections[app.hostID]) return;

        app.question("ping",
            () => { // on successful answer
                if (!app.connections[app.hostID]) return;
                console.log("successfully received ping");
                app.connections[app.hostID].failedPings = 0;
            },
            app.hostID,
            () => { // on timeout (no response)
                if (!app.connections[app.hostID]) return;
                console.log("host timed out");
                if (++app.connections[app.hostID].failedPings >= 4) {
                    app.$refs.chat.systemMessage("Lost connection to host.");
                    app.disconnect();
                }
            }
        );
    }
};