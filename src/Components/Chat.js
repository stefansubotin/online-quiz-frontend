import React, { Component } from 'react';
import AblyFunctions from '../Tools/AblyFunctions';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            type: props.type,
            user: props.user,
            messages: [],
            color: 'black'
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
            messages: messages,
            color: this.state.color
        });
    }

    onMessageSend = (event) => {
        let dat = {
            user: this.state.user,
            message: event.target.value,
            color: this.state.color
        }
        AblyFunctions.sendMessage(this.getChannelId(), 'message', dat);
    }

    onColorChanged = (event) => {
        this.setState({
            room: this.state.room,
            type: this.state.type,
            user: this.state.user,
            messages: this.state.messages,
            color: event.target.value
        });
    }

    getMessageLog() {
        let log = [];
        for (let i = 0; i < this.state.messages.length; i++) {
            let dat = JSON.parse(this.state.messages[i]);
            log.push(<div><span name='user' color={dat.color}>{dat.user}:&nbsp;</span><span name='message' color={dat.color}>{dat.message}</span></div>);
        }
        return log;
    }

    getChatController() {
        return (
            <div name='chatController'>
                <a>User: {this.state.user}</a><br />
                <label for='colorchoice'>Color:&nbsp;</label>
                <select id='colorChoice' onChange={this.onColorChanged}>
                    <option value='black'>Black</option>
                    <option value='green'>Green</option>
                    <option value='blue'>Blue</option>
                    <option value='red'>Red</option>
                </select>
                <form onSubmit={this.onMessageSend}>
                    <input type="text" name="message" placeholder='Input Message' /><br />
                    <input type="submit" value="Send Message" />
                </form>
            </div>
        )
    }

    async componentDidMount() {
        const ably = await AblyFunctions.getAbly();
        const channelId = this.getChannelId();
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe('message', (message) => this.onMessageReceived(message));
    }

    render() {
        return (
            <div>
                {this.getChatController()}
                {this.getMessageLog()}
            </div>
        )
    }
}

export default Chat