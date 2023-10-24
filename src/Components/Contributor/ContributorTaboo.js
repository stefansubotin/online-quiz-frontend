import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorTaboo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collection: props.collection,
            key: props.key,
            answer: '',
            forbiddenWords: []
        }
    }

    onAnswer(e) {
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            answer: e.target.value,
            forbiddenWords: this.state.forbiddenWords
        });
    }

    onFw(e, i){
        let fw = this.state.forbiddenWords;
        fw[i] = e.target.value;
        this.setState({
            collection: this.state.collection,
            key: this.state.key,
            answer: this.state.answer,
            forbiddenWords: fw
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
        console.log(type);
        const response = await fetch(BackendAccess.getUrlContributor(), {
            method: "POST",
            body: JSON.stringify({
                type: type,
                collection: this.state.collection,
                key: this.state.key,
                body: {
                    answer: this.state.answer,
                    forbiddenWords: this.state.forbiddenWords
                }
            }),
            headers: { "Content-Type": "application/json" },
        });
        const item = await response.json();
        console.log(item);
    }

    getDisplay() {
        let display = [];
        display.push(
            <div>
                <label for='answer'>Term To Explain&nbsp;</label>
                <input id='answer' type='text' value={this.state.answer} onChange={(e) => this.onAnswer(e)} />
            </div>);
        display.push(
            <div>
                <label for='fw1'>Forbidden Word 1&nbsp;</label>
                <input id='fw1' type='text' value={this.state.forbiddenWords[0]} onChange={(e) => this.onFw(e, 0)} />
            </div>);
        display.push(
            <div>
                <label for='fw1'>Forbidden Word 2&nbsp;</label>
                <input id='fw1' type='text' value={this.state.forbiddenWords[1]} onChange={(e) => this.onFw(e, 1)} />
            </div>);
        display.push(
            <div>
                <label for='fw1'>Forbidden Word 3&nbsp;</label>
                <input id='fw1' type='text' value={this.state.forbiddenWords[2]} onChange={(e) => this.onFw(e, 2)} />
            </div>);
        display.push(
            <div>
                <label for='fw1'>Forbidden Word 4&nbsp;</label>
                <input id='fw1' type='text' value={this.state.forbiddenWords[3]} onChange={(e) => this.onFw(e, 3)} />
            </div>);
        return display;
    }

    async componentDidMount() {
        console.log(this.props);
        if (this.props.item == "NO_KEY") {
            console.log('new');
            this.setState({
                collection: this.state.collection,
                key: 'NO_KEY',
                answer: '',
                forbiddenWords: ['', '', '', '']
            });
            console.log(1);
            console.log(this.state);
            return;
        }
        else {
            console.log('change');
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

            this.setState({
                collection: this.state.collection,
                key: item.key,
                answer: item.props.answer,
                forbiddenWords: item.props.forbiddenWords
            });
        }
        console.log(this.state);
    }

    render() {
        console.log(this.state);
        return <div>
            <form onSubmit={(e) => this.onSubmit(e)}>
                <input type='submit' value='Save Question' />
            </form>
            <form onSubmit={(e) => this.onCancel(e)}>
                <input type='submit' value='Cancel' />
            </form>
            {this.getDisplay()}
        </div>
    }
}

export default ContributorTaboo