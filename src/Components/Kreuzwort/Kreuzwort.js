import React, { Component } from 'react';
import '../../Stylesheets/kreuzwort.css';
import '../../Stylesheets/span.css';
import AblyFunctions from '../../Tools/AblyFunctions';
import BackendAccess from '../../Tools/BackendAccess';

class Kreuzwort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            room: props.room,
            user: props.user,
            data: props.data,
            lines: []
        }
    }

    getChannelId(){
        return 'kreuzwort' + this.state.room;
    }

    getQuiz() {
        let data = JSON.parse(this.state.data);
        let quiz = [];
        for (let i = 0; i < data.count; i++) {
            let line = [];
            console.log(data.lines[i]);
            line.push(<span>{i + 1}. Frage:</span>)
            line.push(<span className='cellEmptySmall fixedSize invis'>&nbsp;</span>);
            for (let j = 0; j < data.size; j++) {
                if (j + 1 < data.lines[i].start || j + 1 >= data.lines[i].start + data.lines[i].length) {
                    line.push(<span className='cellEmptySmall fixedSize invis'>&nbsp;</span>);
                }
                else {
                    let styleClass = 'cellInput';
                    if (j + 1 == data.msp) styleClass = styleClass + ' inputMsp';
                    else styleClass = styleClass + ' inputNormal';
                    switch (data.lines[i].state) {
                        case 0:
                            styleClass = styleClass + ' uncorrected';
                            break;
                        case 1:
                            styleClass = styleClass + ' right';
                            break;
                        case -1:
                            styleClass = styleClass + ' wrong';
                            break;
                    }
                    let name = i + '_' + j;
                    if (data.lines[i].user == this.state.user) {
                        line.push(<input type='text' name={name} maxLength={1} className={styleClass} defaultValue={this.state.lines[i][j]} onChange={e => this.onChangeLine(e)} />);
                    }
                    else {
                        line.push(<input type='text' name={name} maxLength={1} className={styleClass} defaultValue={this.state.lines[i][j]} readOnly={true} />);
                    }
                }
            }
            line.push(<span className='cellEmptySmall fixedSize invis'>&nbsp;</span>);
            if (data.lines[i].user == this.state.user) {
                line.push(<button name={i} className='cellBig' onClick={e => this.onSubmit(i)}>Submit</button>);
                line.push(<span className='cellEmptySmall fixedSize invis'>&nbsp;</span>);
                line.push(<span className='fixedSize cellQuestion'>{data.lines[i].question}</span>)
            }
            else {
                line.push(<span className='cellBig fixedSize'>{data.lines[i].user}</span>);
                line.push(<span className='cellEmptySmall fixedSize invis'>&nbsp;</span>);
                line.push(<span className='fixedSize invis cellQuestion'>&nbsp;</span>)
            }
            quiz.push(line);
        }
        return quiz;
    }

    getQuizTable() {
        let q = this.getQuiz();
        return (
            <table>
                <tbody>
                    {q.map(ele =>
                        <tr key={ele}>
                            <td>
                                {ele}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }

//#region OnEvent-Functions
    async onChangeLine(event) {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = 'kreuzwort' + this.state.room;
        const channel = ably.channels.get(channelId);
        let eventIdArray = event.target.name.split('_');

        let newLines = this.state.lines;
        newLines[eventIdArray[0]][eventIdArray[1]] = event.target.value;
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            data: this.state.data,
            lines: newLines
        });

        await channel.publish('update', {
            user: this.state.user,
            i: eventIdArray[0],
            j: eventIdArray[1],
            val: event.target.value
        });
        ably.close();
    }

    async onUpdate(message) {
        console.log(message.data);
        let dat = JSON.parse(this.state.data);
        dat.lines[message.data.i].state = 0;
        let newLines = this.state.lines;
        if (message.data.user != this.state.user) {
            newLines[message.data.i][message.data.j] = message.data.val;
        }
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            data: JSON.stringify(dat),
            lines: newLines
        });
        console.log(this.state)
    }

    async onSubmit(event){
        console.log(event);
        let result = '';
        for (let i = 0; i < this.state.lines[event].length; i++){
            if (this.state.lines[event][i] != '') {
                result = result + this.state.lines[event][i];
            }
        }
        console.log(result);
        let dat = JSON.parse(this.state.data)
        let body = {
            type: 0,
            room: this.state.room,
            id: dat.id,
            line: event,
            answer: result
        }
        let url = BackendAccess.getUrlKreuzwort();
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
    }

    async onCorrection(message){
        console.log(message.data);
        let dat = JSON.parse(this.state.data);
        dat.lines[message.data.i].state = message.data.state;
        this.setState({
            init: this.state.init,
            room: this.state.room,
            user: this.state.user,
            data: JSON.stringify(dat),
            lines: this.state.lines
        });
    }
//#endregion
//#region React-Component-Lifetime-Functions
    static getDerivedStateFromProps(props, state) {
        console.log(state)
        if (state.init) {
            console.log('init done');
            return {
                init: true,
                room: state.room,
                user: state.user,
                data: state.data,
                lines: state.lines,
                questions: state.questions
            };
        }
        let lines = [];
        let data = JSON.parse(state.data);
        console.log(data);
        for (let i = 0; i < data.count; i++) {
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
            data: state.data,
            lines: lines
        };
    }

    async componentDidMount() {
        const Ably = require('ably');
        const ably = new Ably.Realtime.Promise('0sa0Qw.VDigAw:OeO1LYUxxUM7VIF4bSsqpHMSZlqMYBxN-cxS0fKeWDE');
        await ably.connection.once('connected');
        const channelId = this.getChannelId();
        const channel = ably.channels.get(channelId);
        await channel.subscribe('update', (message) => this.onUpdate(message));
        await channel.subscribe('correction', (message) => this.onCorrection(message));
    }
//#endregion

    render() {
        return (
            <div name='kreuzwort' style={{display: 'flex'}}>
                <span name='quizTable'>{this.getQuizTable()}</span>
            </div>
        )
    }
}

export default Kreuzwort