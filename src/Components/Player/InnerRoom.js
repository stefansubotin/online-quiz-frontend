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
        };
    }

    async onTest(e) {
        console.log('Hi')
        let dat = JSON.stringify({

        })
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: dat,
            currentComponent: "wwm",
        });
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
                });
                break;
            case "wwm":
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "wwm",
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
                });
                break;
            default:
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    data: dat,
                    currentComponent: "error",
                });
                break;
        }
    }

    async onEnd(message){
        console.log('end');
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            currentComponent: "lobby",
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
