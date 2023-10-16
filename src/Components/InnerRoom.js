import React, { Component } from 'react';
import Domino from './Domino/Domino'
import Lobby from './Lobby';
import Kreuzwort from './Kreuzwort';
import AblyFunctions from '../Tools/AblyFunctions';
import WerWirdMillionaer from './WerWirdMillionaer';

class InnerRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: props.room,
            user: props.user,
            leader: props.leader,
            game: '',
            users: [props.user],
            userCount: 1,
            data: '',
            currentComponent: 'lobby'
        }
    }

    async onStart(message) {
        console.log(message.data)
        let dat = message.data.data;
        console.log(dat)
        switch (message.data.game) {
            case 'kreuzwort':
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    game: this.state.game,
                    users: this.state.users,
                    userCount: this.state.userCount,
                    data: dat,
                    currentComponent: 'kreuzwort'
                });
                break;
            case 'wwm':
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    game: this.state.game,
                    users: this.state.users,
                    userCount: this.state.userCount,
                    data: dat,
                    currentComponent: 'wwm'
                });
                break;
            default:
                this.setState({
                    room: this.state.room,
                    user: this.state.user,
                    leader: this.state.leader,
                    game: this.state.game,
                    users: this.state.users,
                    userCount: this.state.userCount,
                    data: message.data.data,
                    currentComponent: 'kreuzwort'
                });
                break;
        }
    }

    async onJoin(message) {
        console.log(message.data);
        if (message.data.user == this.state.user) return;

        let newUsers = this.state.users;
        newUsers = newUsers.concat([message.data.user]);
        const c = this.state.userCount + 1;

        console.log(newUsers);
        if (this.state.leader) {
            const ably = await AblyFunctions.getAbly()
            const channelId = 'room' + this.state.room;
            const channel = await AblyFunctions.getChannel(ably, channelId);
            await channel.publish('join-res', {
                you: message.data.user,
                users: this.state.users,
                userCount: this.state.userCount
            });
            ably.close();
        }

        this.setStatus(newUsers, c);
        console.log(this.state);
    }

    async onJoinRes(message) {
        console.log(message.data);
        const data = message.data;
        let newUsers = message.data.users
        newUsers = newUsers.concat([this.state.user]);
        const c = this.state.userCount + data.userCount;

        const ably = await AblyFunctions.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        channel.unsubscribe('join-res');
        ably.close();

        this.setStatus(newUsers, c);
        console.log(this.state);
    }

    setStatus(users, c) {
        this.setState({
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            game: this.state.game,
            users: users,
            userCount: c,
            data: this.state.data,
            currentComponent: this.state.currentComponent
        });
    }

    getComponent() {
        let component;
        switch (this.state.currentComponent) {
            case 'lobby':
                component = <Lobby userCount={this.state.userCount} users={this.state.users} leader={this.state.leader} />
                break;
            case 'kreuzwort':
                component = <Kreuzwort room={this.state.room} user={this.state.user} data={this.state.data} />
                break;
            case 'wwm':
                component = <WerWirdMillionaer room={this.state.room} user={this.state.user}  data={this.state.data} />
                break;
            case 'domino':
                component = <Domino></Domino>
                break;
            default:
                component = <div>Error</div>
                break;
        }
        return component;
    }

    getUsers() {
        return this.state.users.join(', ');
    }

    async componentDidMount() {
        const ably = await AblyFunctions.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe('start' + this.state.user, (message) => this.onStart(message));
        await channel.subscribe('join', (message) => this.onJoin(message));

        if (!this.state.leader) {
            console.log('not leader');
            await channel.subscribe('join-res', (message) => this.onJoinRes(message));
            channel.publish('join', {
                user: this.state.user
            });
        }
    }

    render() {
        return (
            <div name='innerRoom'>
                <div name='innerRoomComponent'>{this.getComponent()}</div><br />
                <div name='innerRoomUsers'>{this.getUsers()}</div>
            </div>
        );
    }
}

export default InnerRoom