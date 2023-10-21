import React, { Component } from 'react';
import '../../Stylesheets/span.css';
import BackendAccess from '../../Tools/BackendAccess';

class Taboo extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            data: props.data,
            guesses: [],
            explanations: []
        }
    }

    getChannelId(){
        return 'taboo' + this.state.room;
    }

    async componentDidMount() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);
        await channel.subscribe('update', (message) => this.onUpdate(message));
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default Taboo; 