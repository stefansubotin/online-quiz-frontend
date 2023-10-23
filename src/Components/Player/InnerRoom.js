import React, { Component } from "react";
import '../../Stylesheets/innerRoom.css'
import Domino from "../Domino/Domino";
import Lobby from "./Lobby";
import Kreuzwort from "../Kreuzwort/Kreuzwort";
import AblyFunctions from "../../Tools/AblyFunctions";
import WerWirdMillionaer from "../WerWirdMillionaer/WerWirdMillionaer";
import UserList from "./UserList";
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
            message: ""
        };
    }

    async onStart(message) {
        console.log(message.data);
        let dat = JSON.stringify(message.data.data);
        console.log(dat);
        switch (message.data.game) {
            case "kreuzwort":
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "kreuzwort",
                    users: message.data.users,
                    message: JSON.stringify(message)
                });
                break;
            case "wwm":
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "wwm",
                    users: message.data.users,
                    message: JSON.stringify(message)
                });
                break;
            case "domino":
                console.log("domino gewahlt");
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "domino",
                    users: message.data.users,
                    message: JSON.stringify(message)
                });
                break;
            case "taboo":
                console.log("taboo gewahlt");
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "taboo",
                    users: message.data.users,
                    message: JSON.stringify(message)
                });
                break;
            default:
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "error",
                    users: message.data.users,
                    message: JSON.stringify(message)
                });
                break;
        }
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
                    await channel.detach();
                }
                else if (dat.moderator != "") {
                    await channel.detach();
                }
                break;
            case 'kreuzwort':
                await channel.detach();
                break;
            case 'taboo':
                await channel.detach();
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
            message: this.state.message
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
                    />
                );
                break;
            case "kreuzwort":
                component = (
                    <Kreuzwort
                        room={this.state.room}
                        user={this.state.user}
                        data={this.state.data}
                    />
                );
                break;
            case "wwm":
                component = (
                    <WerWirdMillionaer
                        room={this.state.room}
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
                        room={this.state.room}
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
    }

    render() {
        return (
            <div name="innerRoom" className="innerRoom">
                <UserList
                    room={this.state.room}
                    user={this.state.user}
                    leader={this.state.leader}
                /><br />
                <div name="innerRoomComponent" className="innerRoomComponent">
                    {this.getComponent()}
                </div>
            </div>
        );
    }
}

export default InnerRoom;
