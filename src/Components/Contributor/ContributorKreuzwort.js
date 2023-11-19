import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";
import '../../Stylesheets/kreuzwort.css'

class ContributorKreuzwort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: props.collection,
            key: props.item,
            size: 0,
            userCount: 0,
            msp: 0,
            lines: [],
            questions: []
        }
    }

    onChange(e, i, j) {
        let lines = this.state.lines;
        lines[i][j] = e.target.value;
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: this.state.size,
            userCount: this.state.userCount,
            msp: this.state.msp,
            lines: lines,
            questions: this.state.questions
        });
    }

    onMsp(newMsp) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: this.state.size,
            userCount: this.state.userCount,
            msp: newMsp,
            lines: this.state.lines,
            questions: this.state.questions
        });
    }

    onQuestion(e, i) {
        let questions = this.state.questions;
        questions[i] = e.target.value;
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: this.state.size,
            userCount: this.state.userCount,
            msp: this.state.msp,
            lines: this.state.lines,
            questions: questions
        });
    }

    onSubmit(e) {
        this.sendQuestion();
        this.props.parentCallback({
            content: 'end'
        })
    }

    onCancel(e) {
        this.props.parentCallback({
            content: 'end'
        })
    }

    async sendQuestion() {
        console.log(this.state);
        let type = 'new';
        if (this.state.key != 'NO_KEY') type = 'change';

        let lines = [];
        for (let i = 0; i < this.state.userCount; i++) {
            console.log('i: ' + i)
            let answer = '';
            let start = -1;
            for (let j = 0; j < this.state.size; j++) {
                console.log('j: ' + j)
                if (this.state.lines[i][j] != '') {
                    answer = answer + this.state.lines[i][j];
                    if (start < 0) start = j + 1;
                }
            }
            lines.push({
                id: i + 1,
                start: start,
                question: this.state.questions[i],
                answer: answer
            })
        }
        const response = await fetch(BackendAccess.getUrlContributor(), {
            method: "POST",
            body: JSON.stringify({
                type: type,
                collection: this.props.collection,
                key: this.props.item,
                body: {
                    size: this.state.size,
                    lines: lines,
                    userCount: this.state.userCount,
                    msp: this.state.msp
                }
            }),
            headers: { "Content-Type": "application/json" },
        });
        const item = await response.json();
        console.log(item);
    }

    increaseSize(e) {
        let size = this.state.size + 1;
        let lines = this.state.lines;
        if (lines[0].length < size) {
            for (let i = 0; i < this.state.userCount; i++) {
                lines[i].push('');
            }
        }
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: size,
            userCount: this.state.userCount,
            msp: this.state.msp,
            lines: lines,
            questions: this.state.questions
        });
        console.log(this.state);
    }

    decreaseSize(e) {
        let size = this.state.size - 1;
        let lines = this.state.lines;
        for (let i = 0; i < this.state.userCount; i++) {
            lines[i][size] = '';
        }

        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: size,
            userCount: this.state.userCount,
            msp: this.state.msp,
            lines: lines,
            questions: this.state.questions
        });
    }

    increaseUserCount(e) {
        let userCount = this.state.userCount + 1;
        let lines = this.state.lines;
        let questions = this.state.questions;
        if (lines.length < userCount) {
            let line = [];
            for (let i = 0; i < lines[0].length; i++) {
                line.push('');
            }
            lines.push(line);
            questions.push('');
        }

        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: this.state.size,
            userCount: userCount,
            msp: this.state.msp,
            lines: lines,
            questions: questions
        });
    }

    decreaseUserCount(e) {
        let userCount = this.state.userCount - 1;
        let lines = this.state.lines;
        let questions = this.state.questions;
        for (let i = 0; i < lines[userCount].length; i++) {
            lines[userCount][i] = '';
        }
        questions[userCount] = '';

        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            size: this.state.size,
            userCount: userCount,
            msp: this.state.msp,
            lines: lines,
            questions: questions
        });
    }

    getMsp() {
        let mspLine = [];
        for (let k = 0; k < this.state.size; k++) {
            let checked = k + 1 == this.state.msp;
            mspLine.push(<input className='rounded  bg-secondary text-white cellSmall' type="checkbox" checked={checked} onChange={(e) => this.onMsp(k + 1)} />);
        }
        mspLine.push(<br />);
        return mspLine;
    }

    getLines() {
        console.log(1);
        console.log(lines);
        let lines = [];
        lines.push(this.getMsp());
        console.log(2);
        console.log(lines);
        for (let i = 0; i < this.state.userCount; i++) {
            lines.push(this.getLine(i));
            console.log(3 + i);
            console.log(lines);
        }

        return lines;
    }

    getLine(i) {
        console.log(this.state);
        console.log('i: ' + i);
        let line = [];
        for (let j = 0; j < this.state.size; j++) {
            console.log('j: ' + j);
            let style = 'cellSmall';
            if (j == this.state.msp - 1) style = style + ' inputMsp';
            else style = style + ' inputNormal';

            let value = this.state.lines[i][j];

            line.push(<input type='text' className={style} value={value} maxLength={1} onChange={(e) => this.onChange(e, i, j)} />)
        }
        line.push(<br />);
        return line;
    }

    getTable() {
        let lines = this.getLines();
        return <div>
            {lines}
        </div>
    }

    getQuestions() {
        let questions = [];
        for (let i = 0; i < this.state.userCount; i++) {
            questions.push(<input className="rounded  bg-secondary text-white" type='text' value={this.state.questions[i]} onChange={(e) => this.onQuestion(e, i)} />)
            questions.push(<br />);
        }
        return questions;
    }

    getControls() {
        return <div>
            <button type="button" class="btn btn-secondary" onClick={(e) => this.increaseSize(e)}>+ Width</button>
            <button type="button" class="btn btn-secondary" onClick={(e) => this.decreaseSize(e)}>- Width</button>
            <button type="button" class="btn btn-secondary" onClick={(e) => this.increaseUserCount(e)}>+ Depth</button>
            <button type="button" class="btn btn-secondary" onClick={(e) => this.decreaseUserCount(e)}>- Depth</button>
        </div>
    }

    async componentDidMount() {
        console.log(this.props);
        if (this.props.item == "NO_KEY") {
            let lines = [];
            let questions = [];
            for (let i = 0; i < 2; i++) {
                let line = [];
                line.push('');
                line.push('');
                line.push('');
                line.push('');
                lines.push(line);
                questions.push('');
            }

            this.setState({
                collection: this.state.collection,
                key: this.state.key,
                size: 4,
                userCount: 2,
                msp: 1,
                lines: lines,
                questions: questions
            });

            return;
        }
        else {
            const response = await fetch(BackendAccess.getUrlContributor(), {
                method: "POST",
                body: JSON.stringify({
                    type: 'get',
                    collection: this.props.collection,
                    key: this.props.item
                }),
                headers: { "Content-Type": "application/json" },
            });
            const item = await response.json();
            console.log(item);
            let lines = [];
            let questions = []
            for (let i = 0; i < item.props.lines.length; i++) {
                let line = [];
                for (let j = 0; j < item.props.size; j++) {
                    if ((j + 1) < item.props.lines[i].start || (j + 1) > item.props.lines[i].start + item.props.lines[i].answer.length) line.push('');
                    else line.push(item.props.lines[i].answer.charAt(j + 1 - item.props.lines[i].start));
                }
                lines.push(line);
                questions.push(item.props.lines[i].question);
            }
            this.setState({
                collection: this.state.collection,
                key: this.state.key,
                size: item.props.size,
                userCount: item.props.userCount,
                msp: item.props.msp,
                lines: lines,
                questions: questions
            });
        }
        console.log(this.state);
    }

    render() {
        return <div>
            <form onSubmit={(e) => this.onSubmit(e)}>
                <input className="rounded  bg-secondary text-white" type='submit' value='Save Question' />
            </form>
            <form onSubmit={(e) => this.onCancel(e)}>
                <input className="rounded  bg-secondary text-white" type='submit' value='Cancel' />
            </form>
            {this.getControls()}<br />
            {this.getTable()}<br />
            {this.getQuestions()}
        </div>
    }
}

export default ContributorKreuzwort