import React, { Component } from 'react';
import AblyFunctions from '../Tools/AblyFunctions';

class ChatInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: props.room,
            type: props.type,
            user: props.user,
            color: 'black',
            message: ''
        }
    }

    getChannelId(){
        return 'chat' + this.state.type + '_' + this.state.room;
    }

    onMessageSend = (event) => {
        let dat = {
            user: this.state.user,
            message: this.state.message,
            color: this.state.color
        }
        AblyFunctions.sendMessage(this.getChannelId(), 'message', dat);
        this.setState({
            room: this.state.room,
            type: this.state.type,
            user: this.state.user,
            color: this.state.color,
            message: ''
        });
    }

    onMessageChange = (event) => {
        this.setState({
            room: this.state.room,
            type: this.state.type,
            user: this.state.user,
            color: this.state.color,
            message: event.target.value
        });
    }

    onColorChanged = (event) => {
        this.setState({
            room: this.state.room,
            type: this.state.type,
            user: this.state.user,
            color: event.target.value,
            message: this.state.message
        });
    }

    getChatController() {
        return (
            <div name='chatController'>
                <a>User: {this.state.user}</a><br />
                <label for='colorchoice'>Color:&nbsp;</label>
                <select id='colorChoice' onChange={this.onColorChanged}>
                    {this.getOption('black')}
                    {this.getOption('green')}
                    {this.getOption('red')}
                    {this.getOption('blue')}
                </select>
                <input type="text" name="message" placeholder='Input Message' defaultValue={this.state.message} onChange={this.onMessageChange}/><br />
                <button onClick={this.onMessageSend} value="Send Message" />
            </div>
        )
    }

    getOption(option){
        if (this.state.color == option) {
            return <option value={option} selected>{option}</option>
        }
        else {
            return <option value={option}>{option}</option>
        }
    }

    render() {
        return (
            <div>{this.getChatController()}</div>
        )
    }
}

export default ChatInput
