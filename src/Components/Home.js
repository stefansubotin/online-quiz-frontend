import React, { Component } from 'react';

class Home extends Component {

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
            <div>
                <div style="display: inline">
                    <form onSubmit={this.onTriggerCreate}>
                        <input type="text" name="user" placeholder='Choose Username'/><br/>
                        <input type="text" name="room" placeholder='Choose RoomID'/><br/><br/>
                            <input type="submit" value="Create Lobby" />
                    </form>
                </div>
                <div style="display: inline">
                   <form onSubmit={this.onTriggerJoin}>
                        <input type="text" name="user" placeholder='Choose Username'/><br/>
                        <input type="text" name="room" placeholder='Enter RoomID'/><br/><br/>
                        <input type="submit" value="Join Lobby" />
                    </form>
                </div>
            </div>
        )
    }
}

export default Home;