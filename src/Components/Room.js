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

    async onTestClick(){
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        console.log('Connected to Ably!');
        const channel = ably.channels.get('test');
        channel.publish('greeting', 'hello');
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
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        console.log('Connected to Ably!');
        const channel = ably.channels.get('test');
        await channel.subscribe('greeting', (message) => {
            console.log('Received a greeting message in realtime: ' + message.data)
        });
    }

    render() {
        return (
            <div>
                <div>Room: {this.state.room} // User: {this.state.user}</div><br/><br/><br/><br/>
                <button onClick={this.onTestClick}>Test message</button>
            </div>
        );
    }
}

export default Room