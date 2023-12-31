import React, { Component } from 'react';
import '../../Stylesheets/span.css';

class Player extends Component {

    onTriggerCreate = (event) => {
        this.props.parentCallback({
            room: event.target.room.value,
            user: event.target.user.value,
            leader: true
        });
    }
    onTriggerJoin = (event) => {
        this.props.parentCallback({
            room: event.target.room.value,
            user: event.target.user.value,
            leader: false
        });
    }

    render() {
        return (
            <div name='home'>
                <span className='fixedSize invis size25'>&nbsp;</span>
                <span>
                    <p>Create Lobby</p>
                    <form onSubmit={this.onTriggerCreate}>
                        <input type="text" name="user" placeholder='Choose Username' /><br />
                        <input type="text" name="room" placeholder='Choose RoomID' /><br /><br />
                        <input type="submit" value="Create Lobby" />
                    </form>
                </span>
                <span className='fixedSize invis size25'>&nbsp;</span>
                <span>
                    <p>Join Lobby</p>
                    <form onSubmit={this.onTriggerJoin}>
                        <input type="text" name="user" placeholder='Choose Username' /><br />
                        <input type="text" name="room" placeholder='Enter RoomID' /><br /><br />
                        <input type="submit" value="Join Lobby" />
                    </form>
                </span>
            </div>
        )
    }
}

export default Player;