import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorTaboo extends Component {
    constructor(props){
        super(props);
        this.state = {
            collection: props.collection,
            key: props.key,
            answer: '',
            forbiddenWords: []
        }
    }

    async componentDidMount(){
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
        return <div>Placeholder</div>
    }
}

export default ContributorTaboo