import React, { Component } from 'react';
import AblyFunctions from '../Tools/AblyFunctions';
import ChatInput from './ChatInput';
import ChatLog from './ChatLog';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            type: props.type,
            user: props.user,
        }
    }

    

    

    

    render() {
        return (
            <div name='chat' style={{ backgroundColor: 'gray'}}>  
                <ChatInput room={this.state.room} type={this.state.type} user={this.state.user} />
                <ChatLog room={this.state.room} type={this.state.type} />
            </div>
        )
    }
}

export default Chat