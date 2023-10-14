import React, { Component } from 'react';
//import fetch from 'node-fetch';

class Lobby extends Component {
    // async onStartKreuzwort() {
    //     const body = { 
    //         type: 1
    //      };

    //     const response = await fetch('https://****/kreuzwort', {
    //         method: 'post',
    //         body: JSON.stringify(body),
    //         headers: { 'Content-Type': 'application/json' }
    //     });
    // }

    async onTestClick(){
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        
        const channelId = 'room' + this.state.room;
        const channel = ably.channels.get(channelId);

        const message = {
            type: 'start',
            game: 'kreuzwort',
            data: {
                i: 1
            }
        }

        channel.publish('start', message);
        ably.close();
    }

    render() {
        return (
            <div>
                <button onClick={this.onTestClick}>Starte Kreuzwort</button>
            </div>
        );
    }
}

export default Lobby