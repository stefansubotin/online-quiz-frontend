import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
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

    async componentDidMount(){
        const pusher = Pusher.getInstance();

        await pusher.init({
            apiKey: 'cefecd31795a4e419288',
            cluster: 'eu'
        });

        let channel = await pusher.subscribe({
            channelName: "my-channel",
            onEvent: (event) => {
                this.setState({
                    room: event.eventName,
                    user: event.data
                })
            }
        })
    }

    render(){
        return (
            <div>
                Room: {this.state.room} // User: {this.state.user}
            </div>
        );
    }
}

export default Room