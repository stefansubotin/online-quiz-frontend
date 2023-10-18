import React, { Component } from 'react';
import AblyFunctions from '../Tools/AblyFunctions';
import BackendAccess from '../Tools/BackendAccess';

class Lobby extends Component {
    constructor(props){
        super(props);
        this.state = {
            userCount: 1,
            user: props.user,
            users: [props.user],
            leader: props.leader
        }
    }

    async onStartKreuzwort(event) {
        let users = [];
        console.log(this.state);
        for(let i = 0; i < this.state.userCount; i++){
            users.push({ user: this.state.users[i] });
        }

        const body = {
            type: 1,
            room: this.state.room,
            userCount: this.state.userCount,
            users: users
        };
        let url = BackendAccess.getUrlKreuzwort();
        fetch(url, {
            method: 'POST',
            body: body,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    async onStartDomino() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');

        const channelId = 'room1';
        const channel = ably.channels.get(channelId);

        let mes1;
        let mes2;

        for (let i = 1; i <= 2; i++) {
            if (i == 1) {
                mes1 = {
                    game: 'domino',
                }
            };
            if (i == 2) {
                mes2 = {
                    game: 'domino',
                }
            };
        };
        await channel.publish('startBernd', mes2);
        await channel.publish('startAnna', mes1);
        ably.close();
    }
    
    async onJoin(message) {
        console.log(message.data);
        if (message.data.user == this.state.user) return;

        let newUsers = this.state.users;
        newUsers = newUsers.concat([message.data.user]);
        const c = this.state.userCount + 1;

        this.setState({
            userCount: c,
            user: this.state.user,
            users: newUsers,
            userCount: c,
            leader: this.state.leader
        });
        console.log(this.state);
    }

    async componentDidMount(){
        console.log(this.state);
        const ably = await AblyFunctions.getAbly();
        const channelId = 'room' + this.state.room;
        const channel = await AblyFunctions.getChannel(ably, channelId);
        await channel.subscribe('join', (message) => this.onJoin(message));
    }

    render() {
        return (
            <div name='lobby'>
                <button onClick={e => this.onStartKreuzwort(e)} disabled={!this.state.leader}>Starte Kreuzwort</button>
                <button onClick={this.onStartDomino} disabled={!this.state.leader}>Starte Domino</button>
            </div>
        );
    }
}

export default Lobby