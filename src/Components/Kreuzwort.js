import React, { Component } from 'react';

class Kreuzwort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            room: props.room,
            user: props.user,
            leader: props.leader,
            data: props.data,
            lines: []
        }
    }
    
    async getAbly() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        return ably;
    }

    getQuiz(){
        let data = JSON.parse(this.state.data);
        let quiz = [];
        for (let i = 0; i < data.count; i++) {
            let line = [];
            console.log(data.lines[i]);
            for (let j = 0; j < data.size; j++) {
                if (j+1 < data.lines[i].start || j+1 >= data.lines[i].start + data.lines[i].length) line.push(<div style={{width:'100px'}} />);
                else {
                    let name = i + '_' + j;
                    if (data.user == this.state.user){
                        line.push(<input type='text' name={name} maxLength={1} style={{width:'100px'}} value={this.state.lines[i][j]} onChange={e => this.onChangeLine(e)}/>);
                    }
                    else {
                        line.push(<input type='text' name={name} maxLength={1} style={{width:'100px'}} value={this.state.lines[i][j]} readOnly={true}/>);
                    }
                }
            }
            quiz.push(line);
        }
        return quiz;
    }

    async onChangeLine(event){
        const ably = await this.getAbly();
        const channelId = 'kreuzwort' + this.state.room;
        const channel = ably.channels.get(channelId);
        let eventIdArray = event.target.name.split('_');

        let newLines = this.state.lines;
        newLines[eventIdArray[0]][eventIdArray[1]] = event.target.value;
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            lines: newLines
        });

        channel.publish('update', {
            user: this.state.user,
            i: eventIdArray[0],
            j: eventIdArray[1],
            val: event.target.value
        });
        ably.close();
    }

    async onUpdate(message) {
        if (message.data.user == this.state.user) return;
        let newLines = this.state.lines;
        newLines[message.data.i][message.data.j] = message.data.val;
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            leader: this.state.leader,
            data: this.state.data,
            lines: newLines
        });
    }

    static getDerivedStateFromProps(props, state){
        if (state.init) return;

        let lines= [];
        let data = JSON.parse(state.data);
        console.log(data);
        for (let i = 1; i <= data.count; i++) {
            let line = [];
            for (let j = 1; j <= data.size; j++) {
                line.push('');
            }
            lines.push(line);
        }

        return {
            init: true,
            room: state.room,
            user: state.user,
            leader: state.leader,
            data: state.data,
            lines: lines
        };
    }

    async componentDidMount() {
        const ably = await this.getAbly();
        const channelId = 'kreuzwort' + this.state.room;
        const channel = ably.channels.get(channelId);
        await channel.subscribe('update' + this.state.user, (message) => this.onStart(message));
    }

    render() {
        return (
            <div>
                {this.getQuiz()}
            </div>
        )
    }
}

export default Kreuzwort