import React, { Component } from "react";
import AblyFunctions from "../../Tools/AblyFunctions";
import BackendAccess from "../../Tools/BackendAccess";

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            userCount: 1,
            user: props.user,
            users: [props.user],
            leader: props.leader,
        };
    }

    getDisabled(game) {
        if (!this.state.leader) return true;
        switch (game) {
            case 'kreuzwort':
                if (this.state.users.length > 6) return false;
                return true;
            case 'taboo':
                if (this.state.users.length > 10) return false;
                return true;
            case 'domino':
                //TODO Lena: Bedingungen für Domino implementieren
                return true;
            case 'wwm1':
                if (this.state.users.length != 1) return false;
                return true;
            case 'wwm2':
                if (this.state.users.length != 2) return false;
                return true;
            default:
                return false;
        }
    }

    async onStartKreuzwort(event) {
        let users = [];
        console.log(this.state);
        for (let i = 0; i < this.state.userCount; i++) {
            users.push(this.state.users[i]);
        }

        let body = {
            type: 1,
            room: this.state.room,
            userCount: this.state.userCount,
            users: users,
        };

        let url = BackendAccess.getUrlKreuzwort();
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json)
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }

    async onStartTaboo() {
        let users = [];
        console.log(this.state);
        for (let i = 0; i < this.state.userCount; i++) {
            users.push(this.state.users[i]);
        }

        let body = {
            room: this.state.room,
            userCount: this.state.userCount,
            users: users,
        };

        let url = BackendAccess.getUrl() + 'taboo';
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json)
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }

    async onStartWwm(mod) {
        let users = [];
        console.log(this.state);
        for (let i = 0; i < this.state.userCount; i++) {
            users.push(this.state.users[i]);
        }
        let moderator = "";
        let player = this.state.user;
        if (this.state.users > 1) {
            if (mod) {
                moderator = this.state.users[1];
            }
            else {
                moderator = this.state.users[0];
                player = this.state.users[1];
            }
        }


        let body = {
            room: this.state.room,
            userCount: this.state.userCount,
            moderator: moderator,
            player: player
        };

        let url = BackendAccess.getUrl() + 'wwm';
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json)
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }

    async onStartDomino(event) {
        let users = [];
        console.log(this.state);
        for (let i = 0; i < this.state.userCount; i++) {
            users.push(this.state.users[i]);
        }
        let body = {
            state: -1,
            room: this.state.room,
            userCount: this.state.userCount,
            users: this.state.users,
        };

        let url = BackendAccess.getUrlDomino();
        //https://rapidapi.com/guides/fetch-api-react
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json)
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
    }

    async onJoin(message) {
        console.log(message.data);
        if (message.data.user == this.state.user) return;

        let newUsers = this.state.users;
        newUsers = newUsers.concat([message.data.user]);
        const c = this.state.userCount + 1;

        this.setState({
            room: this.state.room,
            user: this.state.user,
            users: newUsers,
            userCount: c,
            leader: this.state.leader,
        });
        console.log("Lobbystate: ");
        console.log(this.state);
    }

    async componentDidMount() {
        console.log(this.state);
        const ably = await AblyFunctions.getAbly();
        const channelId = "room" + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe("join-lobby", (message) => this.onJoin(message));
    }

    render() {
        return (
            <div name="lobby">
                <button onClick={(e) => this.onStartKreuzwort(e)} disabled={this.getDisabled('kreuzwort')}>Starte Kreuzwort</button>
                <button onClick={(e) => this.onStartDomino(e)} disabled={this.getDisabled('domino')}>Starte Domino</button>
                <button onClick={(e) => this.onStartWwm(false)} disabled={this.getDisabled('wwm1')}>Starte Wwm mit mir als Moderator</button>
                <button onClick={(e) => this.onStartWwm(true)} disabled={this.getDisabled('wwm2')}>Starte Wwm mit anderem User als Moderator</button>
                <button onClick={(e) => this.onStartTaboo()} disabled={this.getDisabled('taboo')}>Starte Taboo</button>
            </div>
        );
    }
}

export default Lobby;
