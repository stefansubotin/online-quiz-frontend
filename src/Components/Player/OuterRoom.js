import React, { Component } from "react";
import InnerRoom from "./InnerRoom";
import Chat from "../Chat/Chat";
import "../../Stylesheets/span.css";

class OuterRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            leader: props.leader,
        };
    }

    handleCallback = (event) => {
        console.log('innercallback');
        this.props.parentCallback();
    }

    render() {
        return (
            <div name="outerRoom" className="row">
                <InnerRoom
                    room={this.state.room}
                    user={this.state.user}
                    leader={this.state.leader}
                    parentCallback={this.handleCallback}
                />
                <Chat room={this.state.room} type="lobby" user={this.state.user} />
            </div>
        );
    }
}

export default OuterRoom;
