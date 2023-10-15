import React, { Component } from 'react';
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
            <div name='chat' style={{ backgroundColor:'lightgray'}}>  
                <div><ChatInput room={this.state.room} type={this.state.type} user={this.state.user} /></div><br/>
                <div><ChatLog room={this.state.room} type={this.state.type} /></div>
            </div>
        )
    }
}

export default Chat