import React, { Component } from "react";
import AblyFunctions from "../../Tools/AblyFunctions";
import BackendAccess from "../../Tools/BackendAccess";

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            userCount: props.users.length,
            user: props.user,
            users: props.users,
            leader: props.leader,
            game: props.game,
            variant: ''
        };
    }

    getDisabled(game) {
        if (!this.state.leader) return true;
        switch (game) {
            case 'kreuzwort':
                if (this.state.users.length <= 6) return false;
                return true;
            case 'taboo':
                if (this.state.users.length <= 10) return false;
                return true;
            case 'domino':
                if (this.state.users.length <= 4) return false;
                return true;
            case 'wwmPlayerMe':
                if (this.state.users.length <= 2) return false;
                return true;
            case 'wwmPlayerOther':
                if (this.state.users.length == 2) return false;
                return true;
            default:
                return false;
        }
    }

    onStart(event) {
        switch (this.state.variant) {
            case 'kreuzwort':
                this.onStartKreuzwort(event);
                return true;
            case 'taboo':
                this.onStartTaboo(event);
                return true;
            case 'domino':
                this.onStartDomino(event);
                return true;
            case 'wwmPlayerMe':
                this.onStartWwm(true);
                return true;
            case 'wwmPlayerOther':
                this.onStartWwm(false);
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

    async onStartTaboo(event) {
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

        let url = BackendAccess.getUrlTaboo();
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
        if (this.state.users.length > 1) {
            if (mod) {
                console.log(2);
                moderator = this.state.users[1];
            }
            else {
                console.log(1);
                moderator = this.state.users[0];
                player = this.state.users[1];
            }
        }


        let body = {
            room: this.state.room,
            userCount: this.state.userCount,
            moderator: moderator,
            player: player,
            users: this.state.users
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

    onVariantChanged(event) {
        this.setState({
            room: this.state.room,
            userCount: this.state.userCount,
            user: this.state.user,
            users: this.state.users,
            leader: this.state.leader,
            game: this.state.game,
            variant: event.target.value
        });
    }

    getVariants() {
        console.log(this.state)
        return (
            <div name='variants'>
                <label for='variants'>Quizvariants:&nbsp;&nbsp;&nbsp;</label>
                <select id='variants' onChange={(e) => this.onVariantChanged(e)} style={{ color: "inherhit", background: "inherit" }}>
                    {this.getVariant('kreuzwort')}
                    {this.getVariant('taboo')}
                    {this.getVariant('domino')}
                    {this.getVariant('wwmPlayerMe')}
                    {this.getVariant('wwmPlayerOther')}
                </select><br />
            </div>
        )
    }

    getVariant(variant) {
        if (this.state.variant == variant) {
            return <option value={variant} selected>{variant}</option>
        }
        else {
            return <option value={variant}>{variant}</option>
        }
    }

    async componentDidMount() {
        console.log(this.state);
        const ably = await AblyFunctions.getAbly();
        const channelId = "room" + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe("join-lobby", (message) => this.onJoin(message));
    }

    render() {
        console.log("lobby render");
        console.log(this.state);
        return (
            <div name="lobby">
                {this.getVariants()}<br/>
                <button onClick={(e) => this.onStart(e)} disabled={this.getDisabled(this.state.variant)}>Start Quiz</button>
            </div>
        );
        // return (
        //     <div name="lobby">
        //         <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onStartKreuzwort(e)} disabled={this.getDisabled('kreuzwort')}>Starte Kreuzwort</button><br />
        //         <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onStartDomino(e)} disabled={this.getDisabled('domino')}>Starte Domino</button><br />
        //         <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onStartWwm(false)} disabled={this.getDisabled('wwmPlayerOther')}>Starte Wwm mit mir als Moderator</button><br />
        //         <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onStartWwm(true)} disabled={this.getDisabled('wwmPlayerMe')}>Starte Wwm mit mir als Spieler</button><br />
        //         <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onStartTaboo(e)} disabled={this.getDisabled('taboo')}>Starte Taboo</button>
        //     </div>
        // );
    }
}

export default Lobby;
