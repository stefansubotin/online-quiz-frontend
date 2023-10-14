import React, { Component } from 'react';

class Kreuzwort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            leader: props.leader,
            data: props.data
        }
    }

    render() {
        return (
            <div>
                {JSON.parse(this.state.data)}
            </div>
        )
    }
}

export default Kreuzwort