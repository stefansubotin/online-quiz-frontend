import React, { Component } from "react";
import '../../Stylesheets/innerRoom.css'
import Domino from "../Domino/Domino";
import Lobby from "./Lobby";
import Kreuzwort from "../Kreuzwort/Kreuzwort";
import AblyFunctions from "../../Tools/AblyFunctions";
import WerWirdMillionaer from "../WerWirdMillionaer/WerWirdMillionaer";
import Taboo from "../Taboo/Taboo";
import BackendAccess from "../../Tools/BackendAccess";

class InnerRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            leader: props.leader,
            data: "",
            currentComponent: "lobby",
            users: [props.user],
            game: 0
        };
    }

    async onStart(message) {
        console.log(message.data);
        let dat = JSON.stringify(message.data.data);
        console.log(dat);
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: dat,
            currentComponent: message.data.game,
            users: this.state.users,
            game: this.state.game
        });
    }

    async onJoin(message) {
        console.log(message.data);
        if (message.data.user == this.state.user) return;

        let newUsers = this.state.users;
        newUsers = newUsers.concat([message.data.user]);

        console.log(newUsers);
        if (this.state.leader) {
            const ably = await AblyFunctions.getAbly();
            const channelId = "room" + this.state.room;
            const channel = await AblyFunctions.getChannel(ably, channelId);
            await channel.publish("join-res", {
                you: message.data.user,
                game: this.state.game,
                users: this.state.users,
            });
            ably.close();
        }

        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            currentComponent: this.state.currentComponent,
            users: newUsers,
            game: this.state.game
        });
        console.log(this.state);
    }

    async onJoinRes(message) {
        console.log(message.data);
        const data = message.data;
        if (data.you != this.state.user) return;
        let newUsers = message.data.users;
        newUsers = newUsers.concat([this.state.user]);

        const ably = await AblyFunctions.getAbly();
        const channelId = "room" + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        channel.unsubscribe("join-res");
        ably.close();

        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            currentComponent: this.state.currentComponent,
            users: newUsers,
            game: data.game
        });
        console.log(this.state);
    }

    async onEnd(message) {
        console.log('end');
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            currentComponent: "lobby",
            users: this.state.users,
            game: this.state.game + 1
        });
    }

    async onLeave(message) {
        console.log("someone left");
        console.log(message);
        console.log(this.state);
        let newUsers = [];
        for (let i = 0; i < this.state.users.length; i++){
            if (message.data.user != this.state.users[i]) newUsers.push(this.state.users[i]);
        }

        let leader = this.state.leader;
        if (message.data.leader && this.state.users[1] == this.state.user) leader = true;

        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: leader,
            data: this.state.data,
            currentComponent: this.state.currentComponent,
            users: newUsers,
            game: this.state.game
        });
    }

    getComponent() {
        let component;
        switch (this.state.currentComponent) {
            case "lobby":
                component = (
                    <Lobby
                        user={this.state.user}
                        leader={this.state.leader}
                        room={this.state.room}
                        users={this.state.users}
                        game={this.state.game}
                    />
                );
                break;
            case "kreuzwort":
                component = (
                    <Kreuzwort
                        room={this.state.room + '_' + this.state.game}
                        user={this.state.user}
                        data={this.state.data}
                    />
                );
                break;
            case "wwm":
                component = (
                    <WerWirdMillionaer
                        room={this.state.room + '_' + this.state.game}
                        user={this.state.user}
                        data={this.state.data}
                    />
                );
                break;
            case "domino":
                component = (
                    <Domino
                        className="game"
                        room={this.state.room + '_' + this.state.game}
                        user={this.state.user}
                        users={this.state.users}
                        data={this.state.data}
                    />
                );
                break;
            case "taboo":
                component = (
                    <Taboo
                        className="game"
                        room={this.state.room + '_' + this.state.game}
                        user={this.state.user}
                        data={this.state.data}
                    />
                );
                break;
            default:
                component = <div>Error</div>;
                break;
        }
        return component;
    }

    getUserList() {
        return this.state.users.join(', ');
    }

    async componentDidMount() {
        const ably = await AblyFunctions.getAbly();
        const channelId = "room" + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe("start" + this.state.user, (message) =>
            this.onStart(message)
        );
        await channel.subscribe("end", (message) =>
            this.onEnd(message)
        );
        await channel.subscribe("join", (message) =>
            this.onJoin(message)
        );
        await channel.subscribe("leave", (message) =>
            this.onLeave(message)
        );

        if (!this.state.leader) {
            console.log("not leader");
            await channel.subscribe("join-res", (message) => this.onJoinRes(message));
            channel.publish("join", {
                user: this.state.user,
            });
            channel.publish("join-lobby", {
                user: this.state.user,
            });
        }
    }

    async leaveLobby(event) {
        console.log(this.state);
        if (this.state.users.length > 1) {
            console.log(">1");
            const ably = await AblyFunctions.getAbly();
            const channelId = "room" + this.state.room;
            const channel = await AblyFunctions.getChannel(ably, channelId);
            await channel.publish("leave", {
                user: this.state.user,
                leader: this.state.leader
            });
        }
        else {
            console.log("1  or 0");
            const response = await fetch(BackendAccess.getUrlLeaveLobby() + this.state.room, {
                method: "DELETE"
            });
            let item = await response.json();
            console.log(item);
        }
        console.log("Left");
        this.props.parentCallback();
    }

    render() {
        return (
            <div className="col-8">
                <div name="innerRoom" className="row">
                    <div className="col-1">
                        <button onClick={(e) => this.leaveLobby(e)}>Leave</button>
                        <p>Room:&nbsp;{this.state.room}</p><br />
                        {this.getUserList()}
                    </div>
                    <div name="innerRoomComponent" className="col-11">
                        {this.getComponent()}
                    </div>
                </div>
            </div>
        );
    }
}

export default InnerRoom;
