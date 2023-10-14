import React, { Component } from 'react';
import Home from './Home';
import Room from './Room';

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
                component = <Home parentCallback={this.handleCallback} />
                break;
            case 'lobby':
                component = <Room room={this.state.room} user={this.state.user} leader={this.state.leader} />
                break;
            default:
                component = <div>Error</div>
                break;
        }
        return component;
    }

    handleCallback = (childData) => {
        this.setState({ 
            room: childData.room,
            user: childData.user,
            leader: childData.leader,
            currentComponent: 'lobby'
        });
    }
    
    render() {
        return (
            <div name='base'>
                {this.getComponent()}
            </div>
        );
    }
}

export default Base;