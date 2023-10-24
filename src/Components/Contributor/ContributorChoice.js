import React, { Component } from "react";
import ContributorKreuzwort from "./ContributorKreuzwort";
import ContributorTaboo from "./ContributorTaboo";
import ContributorSimpleQuestion from "./ContributorSimpleQuestion";

class ContributorChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: false,
            component: 'choice',
            collection: 'kreuzwort',
            key: ''
        }
    }

    onCollectionChanged(event) {
        this.setState({
            list: this.state.list,
            component: this.state.component,
            collection: event.target.value,
            key: this.state.key
        })
    }

    onNew(event) {
        this.setState({
            list: this.state.list,
            component: 'new',
            collection: this.state.collection,
            key: this.state.key
        })
    }

    onEdit(event) {
        this.setState({
            list: this.state.list,
            component: 'edit',
            collection: this.state.collection,
            key: this.state.key
        });
    }

    onList(event) {
        this.props.parentCallback({
            list: !this.state.list
        })
        this.setState({
            list: !this.state.list,
            component: this.state.component,
            collection: this.state.collection,
            key: this.state.key
        })
    }

    getComponent() {
        switch (this.state.component) {
            case 'choice':
                return this.getBase()
            case 'new':
                return this.getSingleQuestion(this.state.collection, '');
            case 'edit':
                return this.getSingleQuestion(this.state.collection, this.state.key);
            default:
                return <div>Error Homepage</div>
        }
    }

    getSingleQuestion(collection, key) {
        switch (collection) {
            case 'kreuzwort':
                return <ContributorKreuzwort collection={collection} key={key} />
            case 'taboo':
                return <ContributorTaboo collection={collection} key={key} />
            case 'simpleQuestion':
                return <ContributorSimpleQuestion collection={collection} key={key} />
            default:
                return <div>Error</div>
        }
    }

    getBase() {
        let list = 'Display Question List';
        if (!this.state.list) list = 'Hide Question List';
        return <div>
            <select id='colorChoice' onChange={(e) => this.onCollectionChanged(e)}>
                {this.getOptions('kreuzwort')}
                {this.getOptions('taboo')}
                {this.getOptions('simpleQuestion')}
            </select><br />
            <label for='key'>Key If Editing Existiong Question</label>
            <input type='text' id='key' onChange={(e) => this.onKeyChanged(e)} placeholder="Input Key" /><br />
            <button onClick={e => this.onNew(e)}>New Question</button>
            <button onClick={e => this.onEdit(e)}>Edit Question</button><br /><br />
            <button onClick={e => this.onList(e)}>{list}</button>
        </div>
    }

    getOptions(type) {
        if (this.state.collection == type) {
            return <option value={type} selected>{type}</option>
        }
        else {
            return <option value={type}>{type}</option>
        }
    }

    getOtionsName(type) {
        switch (type) {
            case 'kreuzwort':
                return 'Kreuzwort';
            case 'taboo':
                return 'Taboo';
            case 'simpleQuestion':
                return 'Simple Question';
            default:
                return 'error'
        }
    }

    render() {
        return (
            <div name='contrHomepage'>
                {this.getBase()}<br/>
                {this.getComponent()}
            </div>
        )
    }
}

export default ContributorChoice;