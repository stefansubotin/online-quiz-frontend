import React, { Component } from 'react';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: '',
            user: '',
            leader: false,
            game: '',
            users: []
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            room: props.room,
            user: props.user,
            leader: props.leader,
            game: state.game,
            users: state.users
        }
    }

    async componentDidMount() {
        const Pusher = require("pusher");

        const pusher = new Pusher({
            appId: "1679697",
            key: "cefecd31795a4e419288",
            secret: "69192cf5d43c8f457530",
            cluster: "eu",
            useTLS: true
        });

        pusher.trigger("my-channel", "my-event", {
            message: "hello world"
        });
    }

    render() {
        return (
            <div>
                Room: {this.state.room} // User: {this.state.user}
            </div>
        );
    }
}

export default Room