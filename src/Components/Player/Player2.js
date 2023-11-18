import React, { Component } from 'react';
import BackendAccess from '../../Tools/BackendAccess';
import '../../Stylesheets/span.css';

class Player2 extends Component {

    async onTriggerCreate(event) {
        const response = await fetch(BackendAccess.getUrlContributor(), {
            method: "POST",
            body: JSON.stringify({
                type: type,
                collection: this.state.collection,
                key: this.state.key,
                body: {
                    answer: this.state.answer,
                    forbiddenWords: this.state.forbiddenWords
                }
            }),
            headers: { "Content-Type": "application/json" },
        });
        const item = await response.json();
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
            <div name='home' style={{ display: 'flex' }}>
                <span className='fixedSize invis size25'>&nbsp;</span>
                <span>
                    <p>Create Lobby</p>
                    <form onSubmit={(e) => this.onTriggerCreate(e)}>
                        <input type="text" name="user" placeholder='Choose Username' required='true' /><br />
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

export default Player2;