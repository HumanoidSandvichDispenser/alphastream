import broadcastType from "./broadcastType";

export default {
    send: function(app, data, ids) {
        if (app.peer.disconnected) {
            console.log("You have been disconnected and can not broadcast any messages.");
            return;
        }

        console.log("Broadcasting data");
        console.log(data);
        Object.keys(app.connections)
            .filter(x => ids == undefined || ids.includes(x)) // filter if ids is specified
            .forEach((id) => { app.connections[id].peer.send(data); });
    },
    receive: function(app, data) {
        if (data.type == broadcastType.type.message) {
            app.$refs.chat.pushMessage(data.body.author, data.body.badge, data.body.content);
            console.log("received message: " + data.body.content);
        } else if (data.type == broadcastType.type.connect) {
            app.$refs.chat.systemMessage(`${data.body.username} connected`);
            new Promise(resolve => setTimeout(resolve, 1))
                .then(() => {
                    if (app.connections[data.sender]) {
                        app.connections[data.sender].username = data.body.username;
                        app.connections[data.sender].failedPings = 0;
                    }
                });
        } else if (data.type == broadcastType.type.disconnect) {
            app.$refs.chat.systemMessage(`${app.connections[data.sender].username} disconnected`);
            app.connections[data.sender].peer.close();
            delete app.connections[data.sender]; // remove connection
        } else if (data.type == broadcastType.type.connectBack) {
            console.log("Received connection and connecting back to " + data.sender);
            app.connectToPeer(data.sender, true, false);
        } else if (data.type == broadcastType.type.mergeConnections) {
            console.log("Merging connection with IDS: " + data.body.join(", "));
            data.body.forEach((id) => new Promise(() => { app.connectToPeer(id) }));
        } else if (data.type == broadcastType.type.nameChange) {
            const message = `${data.body.oldName} changed their name to ${data.body.newName}`;
            console.log(message);
            app.$refs.chat.systemMessage(message);
            app.connections[data.sender].username = data.body.newName;
        } else if (data.type == broadcastType.type.ping) {
            const latency = new Date().getTime() - data.body.time;
            this.send(app, {
                type: broadcastType.type.pong,
                sender: app.peer.id,
                body: {
                    latency: latency
                }
            }, data.sender);
        } else if (data.type == broadcastType.type.pong) {
            const latency = data.body.latency; // time it took for peers to receive message
            app.$refs.chat.systemMessage(`${app.connections[data.sender].username}: ${latency} ms`);
        } else if (data.type == broadcastType.type.question) {
            console.log("received question");
            this.send(app, {
                type: broadcastType.type.answer,
                sender: app.peer.id,
                body: {
                    question: data.body.question,
                    questionID: data.body.questionID,
                    answer: app.answer(data.sender, data.body.question),
                },
            });
        } else if (data.type == broadcastType.type.answer) {
            if (app.questions[data.body.questionID] == undefined) return;
            app.questions[data.body.questionID](data.body.answer);
            delete app.questions[data.body.questionID];
        } else if (data.type == broadcastType.type.kick) {
            if (data.sender == app.hostID) {
                app.$refs.chat.systemMessage(`Host forcefully closed connection to ${app.connections[data.body.id].username} (${data.body.reason})`);
                app.connections[data.sender].close();
                delete app.connections[data.body.id];
            }
        }
    },
};