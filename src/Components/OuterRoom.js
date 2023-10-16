import React, { Component } from 'react';
import InnerRoom from './InnerRoom';
import Chat from './Chat';
import '../Stylesheets/span.css'

class OuterRoom extends Component {
    constructor(props){
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            leader: props.leader
        }
    }

    render() {
        return (
            <div name='outerRoom' style={{display: 'flex'}}>
                <InnerRoom room={this.state.room} user={this.state.user} leader={this.state.leader} />
                <span className='fixedSize invis size25'>&nbsp;</span>
                <Chat room={this.state.room} type='lobby' user={this.state.user}/>
            </div>
        )
    }
}

export default OuterRoom