import React, { Component } from 'react';

class Kreuzwort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: '',
            user: '',
            leader: false,
            users: [],
            data: {}
        }
    }

    render() {
        return (
            <div>
                Placeholder Kreuzwort
            </div>
        )
    }
}

export default Kreuzwort