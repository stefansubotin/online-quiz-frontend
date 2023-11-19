import React, { Component } from 'react';
import BackendAccess from '../../Tools/BackendAccess';
import '../../Stylesheets/span.css';

class Player2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: ''
        }
    }

    onTriggerCreate(event) {
        this.props.parentCallback({
            room: this.state.room,
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

    async onNewCode(event) {
        const response = await fetch(BackendAccess.getUrlLobby(), {
            method: "GET"
        });
        const item = await response.json();
        console.log(item);
        this.setState({
            room: item.code
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
                        <button type="submit" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onNewCode(e)} disabled={this.state.room != ''}>Create Lobby</button>
                    </form>
                    <button type="button" style={{ margin: '10px' }} class="btn btn-secondary" onClick={(e) => this.onNewCode(e)} disabled={this.state.room != ''}>New Roomcode</button><br />
                </span>
                <span className='fixedSize invis size25'>&nbsp;</span>
                <span>
                    <p>Join Lobby</p>
                    <form onSubmit={this.onTriggerJoin}>
                        <input type="text" name="user" placeholder='Choose Username' /><br />
                        <input type="text" name="room" placeholder='Enter RoomID' /><br /><br />
                        <button type="submit" style={{ margin: '10px' }} class="btn btn-secondary" value="Join Lobby" />
                    </form>
                </span>
                <span>

                </span>
            </div>
        )
    }
}

export default Player2;