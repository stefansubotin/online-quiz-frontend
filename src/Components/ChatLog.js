import React, { Component } from 'react';
import AblyFunctions from '../Tools/AblyFunctions';

class ChatLog extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: props.room,
            type: props.type,
            messages: []
        }
    }

    getChannelId(){
        return 'chat' + this.state.type + '_' + this.state.room;
    }

    async onMessageReceived(message) {
        let dat = {
            user: message.data.user,
            message: message.data.message,
            color: message.data.color
        }
        let messages = this.state.messages;
        messages.push(JSON.stringify(dat));
        this.setState({
            room: this.state.room,
            type: this.state.type,
            user: this.state.user,
            messages: messages
        });
    }
    
    getMessageLog() {
        let log = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            let dat = JSON.parse(this.state.messages[i]);
            let color = { color: dat.color };
            log.push(<div><span name='user' style={color}>{dat.user}:&nbsp;</span><span name='message' style={color}>{dat.message}</span></div>);
        }
        return log;
    }

    async componentDidMount() {
        const ably = await AblyFunctions.getAbly();
        const channelId = this.getChannelId();
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe('message', (message) => this.onMessageReceived(message));
    }

    render() {
        return (
            <div name='log'>{this.getMessageLog()}</div>
        )
    }
}

export default ChatLog