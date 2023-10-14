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
            users: [],
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
            this.setState({
                room: this.state.room,
                user: this.state.user,
                leader: this.state.leader,
                game: this.state.game,
                users: this.state.users.push(message.data.user),
                data: this.state.data,
                currentComponent: this.state.currentComponent
            });
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

    static getDerivedStateFromProps(props, state) {
        return {
            room: props.room,
            user: props.user,
            leader: props.leader,
            game: state.game,
            users: state.users.push(props.user),
            data: this.state.data,
            currentComponent: state.currentComponent
        }
    }

    async componentDidMount() {
        const ably = await this.getAbly();
        console.log('Connected to Ably!');
        const channel = ably.channels.get('test');
        await channel.subscribe('start', this.onStart(message));
        await channel.subscribe('join', this.onJoin(message));

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
                <div>{this.state.users}</div>
                <Chat />
            </div>
        );
    }
}

export default Room