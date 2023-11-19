import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: true,
            fullList: '',
            filterKreuzwort: true,
            filterSimpleQuestion: false,
            filterTaboo: false,
        }
    }

    filterList() {
        let dat = JSON.parse(this.state.fullList);
        if (!this.state.filterKreuzwort && !this.state.filterSimpleQuestion && !this.state.filterTaboo) return dat.results;
        let lst = [];
        for (let i = 0; i < dat.results.length; i++) {
            if (this.state.filterKreuzwort && dat.results[i].collection == 'kreuzwort') lst.push(dat.results[i]);
            if (this.state.filterTaboo && dat.results[i].collection == 'taboo') lst.push(dat.results[i]);
            if (this.state.filterSimpleQuestion && dat.results[i].collection == 'simpleQuestion') lst.push(dat.results[i]);
        }
        return lst;
    }

    getDisplayList() {
        let list = this.filterList();
        let display = [];
        display.push(<tr>
            <th>Collection</th>
            <th>Key</th>
            <th colSpan={3}>More Data</th>
        </tr>)
        for (let i = 0; i < list.length; i++) {
            switch (list[i].collection) {
                case 'kreuzwort':
                    let msw = '';
                    let msp = list[i].props.msp;
                    for (let j = 0; j < list[i].props.lines.length; j++) {
                        let answer = list[i].props.lines[j].answer;
                        let mspLine = msp - list[i].props.lines[j].start;
                        msw = msw + answer.charAt(mspLine);
                    }
                    display.push(
                        <tr>
                            <td>Collection:&nbsp;&#091;{list[i].collection}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Key:&nbsp;&#091;{list[i].key}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Width:&nbsp;&#091;{list[i].props.size}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Depth:&nbsp;&#091;{list[i].props.lines.length}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Vertical&nbsp;Word:&nbsp;&#091;{msw}&#093;</td>
                        </tr>
                    );
                    break;
                case 'taboo':
                    display.push(
                        <tr>
                            <td>Collection:&nbsp;&#091;{list[i].collection}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Key:&nbsp;&#091;{list[i].key}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Term&nbsp;To&nbsp;Explain:&nbsp;&#091;{list[i].props.answer}&#093;</td>
                        </tr>
                    );
                    break;
                case 'simpleQuestion':
                    display.push(
                        <tr>
                            <td>Collection:&nbsp;&#091;{list[i].collection}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Key:&nbsp;&#091;{list[i].key}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>Question:&nbsp;&#091;{list[i].props.question}&#093;&nbsp;&#47;&nbsp;</td>
                            <td>AnswerCount:&nbsp;&#091;{list[i].props.answerCount}&#093;</td>
                        </tr>
                    );
                    break;
            }
        }
        return display;
    }

    getDisplay() {
        if (this.state.init) return <>Loading...</>
        let list = this.getDisplayList();
        return <div>
            <div>
                <input className="rounded  bg-secondary text-white" type="checkbox" id="kw" onChange={(e) => this.onCheck('kw', e)} />
                <label for="kw"> Kreuzwort</label><br />
                <input className="rounded  bg-secondary text-white" type="checkbox" id="taboo" onChange={(e) => this.onCheck('taboo', e)} />
                <label for="taboo"> Taboo</label><br />
                <input className="rounded  bg-secondary text-white" type="checkbox" id="simple" onChange={(e) => this.onCheck('simple', e)} />
                <label for="simple"> Simple Question</label><br /><br />
                {list}
            </div>
        </div>
    }

    onCheck(type, event) {
        switch (type) {
            case 'kw':
                this.setState(this.state = {
                    fullList: this.state.fullList,
                    filterKreuzwort: event.target.checked,
                    filterSimpleQuestion: this.state.filterSimpleQuestion,
                    filterTaboo: this.state.filterTaboo
                });
                break;
            case 'taboo':
                this.setState(this.state = {
                    fullList: this.state.fullList,
                    filterKreuzwort: this.state.filterKreuzwort,
                    filterSimpleQuestion: this.state.filterSimpleQuestion,
                    filterTaboo: event.target.checked
                });
                break;
            case 'simple':
                this.setState(this.state = {
                    fullList: this.state.fullList,
                    filterKreuzwort: this.state.filterKreuzwort,
                    filterSimpleQuestion: event.target.checked,
                    filterTaboo: this.state.filterTaboo
                });
                break;
        }
    }

    async componentDidMount() {
        const response = await fetch(BackendAccess.getUrlContributor());
        const items = await response.json();
        console.log(items);

        this.setState({
            init: false,
            fullList: JSON.stringify(items),
            filterKreuzwort: false,
            filterSimpleQuestion: false,
            filterTaboo: false
        });

        console.log(this.state);
    }

    render() {
        return (
            <>{this.getDisplay()}</>
        )
    }
}

export default ContributorList