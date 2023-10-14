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

    async onTestClick() {
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
                    game: 'kreuzwort',
                    data: JSON.stringify({
                        id: -1,
                        size: 10,
                        count: 2,
                        msp: 5,
                        lines: [
                            {
                                id: 1,
                                start: 3,
                                length: 5,
                                user: 'Anna',
                                question: 'Wie heißt der andere User?'
                            },
                            {
                                id: 2,
                                start: 4,
                                length: 4,
                                user: 'Bernd'
                            }
                        ]
                    })
                }
            };
            if (i == 2) {
                mes2 = {
                    game: 'kreuzwort',
                    data: JSON.stringify({
                        id: -1,
                        size: 10,
                        count: 2,
                        msp: 5,
                        lines: [
                            {
                                id: 1,
                                start: 3,
                                length: 5,
                                user: 'Anna'
                            },
                            {
                                id: 2,
                                start: 4,
                                length: 4,
                                user: 'Bernd',
                                question: 'Wie heißt der andere User?'
                            }
                        ]
                    })
                }
            };
        };
        await channel.publish('startBernd', mes2);
        await channel.publish('startAnna', mes1);
        ably.close();
    }

    render() {
        return (
            <div name='lobby'>
                <button onClick={this.onTestClick}>Starte Kreuzwort</button>
            </div>
        );
    }
}

export default Lobby