import React, { Component } from 'react';
import AblyFunctions from '../Tools/AblyFunctions';

class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: props.room,
            type: props.type,
            user: props.user,
            messages: [],
            color: 'black'
        }
    }

    async onMessageReceived(message) {
        let dat = {
            user: message.data.user,
            message: message.data.message
        }
        let messages = this.state.messages;
        messages.push(JSON.stringify(dat));
        this.setState({
            room: this.state.room,
            type: this.state.type,
            user: this.state.user,
            messages: messages,
            color: this.state.color
        });
    }

    async onMessageSend(event){

    }

    getMessageLog(){
        let log = [];
        for (let i = 0; i < this.state.messages.length; i++){
            let dat = JSON.parse(this.state.messages[i]);
            log.push(<div><span name='user' color={this.state.color}>{dat.user}:&nbsp;</span><span name='message' color={this.state.color}>{dat.message}</span></div>);
        }
        return log;
    }

    getChatController(){
        return (
            <div name='chatController'>
                <a>User: {this.state.user}</a><br/>
                <label for=''>Color:&nbsp;</label>
            </div>
        )
    }
    
    async componentDidMount(){
        const ably = await AblyFunctions.getAbly();
        const channelId = 'chat' + this.state.type + '_' + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe('message', (message) => this.onMessageReceived(message));
    }
    
    render() {
        return (
            <div>
                {}
                {this.getMessageLog()}
            </div>
        )
    }
}

export default Chat