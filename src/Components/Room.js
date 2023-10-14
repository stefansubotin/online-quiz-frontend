import React, { Component } from 'react';
import Lobby from './Lobby';
import Kreuzwort from './Kreuzwort';
import Chat from './Chat';

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: '',
            user: '',
            leader: false,
            game: '',
            users: [''],
            data: {},
            currentComponent: 'lobby'
        }
    }

    async getAbly() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        return ably;
    }

    async onTestClick() {
        const ably = await this.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = ably.channels.get(channelId);
        channel.publish('greeting', 'hello');
        ably.close();
    }

    async onStart(message) {
        console.log('Received message in realtime: ' + message.data)
        if (message.data.type == 'start') {
            switch (message.data.game) {
                case 'kreuzwort':
                    this.setState({
                        room: this.state.room,
                        user: this.state.user,
                        leader: this.state.leader,
                        game: this.state.game,
                        users: this.state.users,
                        data: message.data.data,
                        currentComponent: 'kreuzwort'
                    });
                    break;

            }
        }

    }

    async onJoin(message) {      
        if (message.data.type == 'join') {
            console.log(this.state.users)
            let newState = this.state;
            let newUsers = newState.users;
            console.log(newUsers);
            newUsers.push(message.data.user);
            console.log(newUsers);
            console.log(newState);
            newState.users = newUsers;
            console.log(newState);
            this.setState({
                room: this.state.room,
                user: this.state.user,
                leader: this.state.leader,
                game: this.state.game,
                users: newUsers,
                data: this.state.data,
                currentComponent: this.state.component
            });
            console.log(message.data);
            console.log(this.state);
        }
    }

    getComponent() {
        let component;
        switch (this.state.currentComponent) {
            case 'lobby':
                component = <Lobby />
                break;
            case 'kreuzwort':
                component = <Kreuzwort />
                break;
            default:
                component = <div>Error</div>
                break;
        }
        return component;
    }

    getUsers() {
        let users = this.state.users.join(', ');
        return users;
    }

    static getDerivedStateFromProps(props, state) {
        
        return {
            room: props.room,
            user: props.user,
            leader: props.leader,
            game: state.game,
            users: [props.user],
            data: state.data,
            currentComponent: state.currentComponent
        }
    }

    async componentDidMount() {
        const ably = await this.getAbly();
        console.log('Connected to Ably!');
        const channel = ably.channels.get('test');
        await channel.subscribe('start', (message) => this.onStart(message));
        await channel.subscribe('join', (message) => this.onJoin(message));

        if (!this.state.leader){
            channel.publish('join', {
                type: 'join',
                user: this.state.user
            });
        }
    }

    render() {
        return (
            <div>
                <div>{ this.getComponent() }</div><br/>
                <div>{this.getUsers()}</div>
                <Chat />
            </div>
        );
    }
}

export default Room