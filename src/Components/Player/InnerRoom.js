import React, { Component } from "react";
import '../../Stylesheets/innerRoom.css'
import Domino from "../Domino/Domino";
import Lobby from "./Lobby";
import Kreuzwort from "../Kreuzwort/Kreuzwort";
import AblyFunctions from "../../Tools/AblyFunctions";
import WerWirdMillionaer from "../WerWirdMillionaer/WerWirdMillionaer";
import Taboo from "../Taboo/Taboo";

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
            message: "",
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
            message: JSON.stringify(message),
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
                users: this.state.users
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
            message: this.state.message,
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
            message: this.state.message,
            game: this.state.game
        });
        console.log(this.state);
    }

    async onEnd(message) {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');

        let start = JSON.parse(this.state.message);
        const channelId = start.data.game + this.state.room;
        console.log(channelId);
        const channel = ably.channels.get(channelId);
        channel.on('detached', function(stateChange) {
            console.log('detached from the channel ' + channel.name);
          });
        switch (start.data.game) {
            case 'wwm':
                let dat = start.data.data;
                if (dat.moderator == this.state.user) {
                    await channel.unsubscribe('player');
                }
                else if (dat.moderator != "") {
                    await channel.unsubscribe('moderator');
                }
                break;
            case 'kreuzwort':
                await channel.unsubscribe('update');
                await channel.unsubscribe('correction');
                break;
            case 'taboo':
                await channel.unsubscribe('message');
                await channel.unsubscribe('system');
                break;
            case 'domino':
                //TODO Lena: hier für domino ergänzen
                break;
        }
        ably.close();
        console.log('end');
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            currentComponent: "lobby",
            users: this.state.users,
            message: this.state.message,
            game: this.state.game + 1
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
                        room={this.state.room}
                        user={this.state.user}
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

    getUserList(){
        // let users = [];
        // for (let i = 0; i < this.state.users.length; i++){
        //     console.log(this.state.users[i]);
        //     users.push(<div>{this.state.users[i]}</div>)
        //     users.push(<br/>);
        // }
        // return users;
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
        await channel.subscribe("join", (message) => this.onJoin(message));
    
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

    render() {
        return (
            <div name="innerRoom" className="innerRoom">
                <div>{this.getUserList()}</div>
                <br />
                <div name="innerRoomComponent" className="innerRoomComponent">
                    {this.getComponent()}
                </div>
            </div>
        );
    }
}

export default InnerRoom;
