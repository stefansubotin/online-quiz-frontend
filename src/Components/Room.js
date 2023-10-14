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
            users: "",
            userCount: 0,
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
        console.log(message.data);
        if (message.data.user == this.state.user) return;

        const newUsers = this.state.users + ',' + message.data.user;
        const c = this.state.userCount + 1;
        
        console.log(newUsers);
        const ably = await this.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = ably.channels.get(channelId);
        await channel.publish('join-res', {
            user: this.state.users,
            userCount: this.state.userCount
        });
        ably.close();
        
        this.setStatus(newUsers);
        console.log(this.state);
    }
    async onJoinRes(message) {
        console.log(message.data);
        const data = message.data;
        const newUsers = data.user + ',' + this.state.users;
        const c = this.state.userCount + data.userCount;
        
        const ably = await this.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = ably.channels.get(channelId);
        channel.unsubscribe('join-res');
        ably.close();
        
        this.setStatus(newUsers);
        console.log(this.state);
    }

    setStatus(test){
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            game: this.state.game,
            users: test,
            userCount: 1,
            data: this.state.data,
            currentComponent: this.state.currentComponent
        });
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
            users: props.user,
            userCount: 1,
            data: state.data,
            currentComponent: state.currentComponent
        }
    }

    async componentDidMount() {
        const ably = await this.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = ably.channels.get(channelId);
        await channel.subscribe('start', (message) => this.onStart(message));
        await channel.subscribe('join', (message) => this.onJoin(message));

        if (!this.state.leader) {
            console.log('not leader');
            await channel.subscribe('join-res', (message) => this.onJoinRes(message));
            channel.publish('join', {
                type: 'join',
                user: this.state.user
            });
        }
    }

    render() {
        return (
            <div>
                <div>{this.getComponent()}</div><br />
                <div>{this.state.users}</div>
                <Chat />
            </div>
        );
    }
}

export default Room