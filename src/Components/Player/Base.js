import React, { Component } from 'react';
import Player from './Player2';
import OuterRoom from './OuterRoom';

class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentComponent: 'home',
            room: '', 
            user: '',
            leader: false
        };
    }

    getComponent() {
        let component;
        switch (this.state.currentComponent) {
            case 'home':
                component = <Player parentCallback={this.handlePlayerChoice} />
                break;
            case 'lobby':
                component = <OuterRoom room={this.state.room} user={this.state.user} leader={this.state.leader} parentCallback={this.handleLeaveLobby} />
                break;
            default:
                component = <div>Error</div>
                break;
        }
        return component;
    }

    handlePlayerChoice = (childData) => {
        this.setState({ 
            room: childData.room,
            user: childData.user,
            leader: childData.leader,
            currentComponent: 'lobby'
        });
    }

    handleLeaveLobby = (event) => {
        console.log('outercallback');
        this.setState({ 
            room: '',
            user: '',
            leader: '',
            currentComponent: 'lobby'
        });
    }
    
    render() {
        return (
            <div name='base' className='container'>
                {this.getComponent()}
            </div>
        );
    }
}

export default Base;