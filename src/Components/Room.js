import React, { Component } from 'react';
import Pusher from 'pusher';

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

    componentDidMount(){
        var pusher = new Pusher('cefecd31795a4e419288', {
            cluster: 'eu'
        });

        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function(data) {
            alert(JSON.stringify(data));
        });
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