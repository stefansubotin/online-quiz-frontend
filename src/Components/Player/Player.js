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
            <div name='home' style={{ display: 'flex', alignItems: 'center' }}>
                <span className='fixedSize invis size25'>&nbsp;</span>
                <span>
                    <p>Create Lobby</p>
                    <form onSubmit={this.onTriggerCreate}>
                        <input type="text" name="user" placeholder='Choose Username' /><br />
                        <input type="text" name="room" placeholder='Choose RoomID' /><br /><br />
                        <input type="submit" value="Create Lobby" />
                        <button type="button" class="btn btn-secondary">Submit</button>
                    </form>
                </span>
                <span className='fixedSize invis size25'>&nbsp;</span>
                <span>
                    <p>Join Lobby</p>
                    <form >
                        <input type="text" name="user" placeholder='Choose Username' /><br />
                        <input type="text" name="room" placeholder='Enter RoomID' /><br /><br />
                        <input type="submit" value="Join Lobby" />
                        <button type="button" class="btn btn-secondary" onClick={this.onTriggerJoin}>Join Lobby</button>
                    </form>
                </span>
            </div>
        )
    }
}

export default Player;