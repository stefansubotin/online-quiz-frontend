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