import React, { Component } from "react";
import ContributorKreuzwort from "./ContributorKreuzwort";
import ContributorTaboo from "./ContributorTaboo";
import ContributorSimpleQuestion from "./ContributorSimpleQuestion";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: 'choice',
            collection: 'kreuzwort',
            key: ''
        }
    }

    handleCallback = (childData) => {
        this.setState({
            component: 'choice',
            collection: this.state.collection,
            key: this.state.key
        })
    }

    onCollectionChanged(event) {
        this.setState({
            component: this.state.component,
            collection: event.target.value,
            key: this.state.key
        })
    }

    onKeyChanged(event) {
        this.setState({
            component: this.state.component,
            collection: this.state.collection,
            key: event.target.value
        })
    }

    onNew(event) {
        this.setState({
            component: 'new',
            collection: this.state.collection,
            key: this.state.key
        })
    }

    onEdit(event) {
        this.setState({
            component: 'edit',
            collection: this.state.collection,
            key: this.state.key
        });
    }

    async onDelete(event) {
        const response = await fetch(BackendAccess.getUrlContributor(), {
            method: "DELETE",
            body: JSON.stringify({
                collection: this.state.collection,
                key: this.state.key
            }),
            headers: { "Content-Type": "application/json" },
        });
        const item = await response.json();
        console.log(item);
    }

    getComponent() {
        let display = [];
        switch (this.state.component) {
            case 'choice':
                return this.getBase()
            case 'new':
                display.push(this.getSingleQuestion(this.state.collection, 'NO_KEY'));
                return display;
            case 'edit':
                display.push(this.getSingleQuestion(this.state.collection, this.state.key));
                return display;
            default:
                return <div>Error Homepage</div>
        }
    }

    getSingleQuestion(collection, key) {
        console.log(collection + ', ' + key);
        switch (collection) {
            case 'kreuzwort':
                return <ContributorKreuzwort collection={collection} item={key} parentCallback={this.handleCallback} />
            case 'taboo':
                return <ContributorTaboo collection={collection} item={key} parentCallback={this.handleCallback} />
            case 'simpleQuestion':
                return <ContributorSimpleQuestion collection={collection} item={key} parentCallback={this.handleCallback} />
            default:
                return <div>Error</div>
        }
    }

    getBase() {
        return <div>
            <label for='colChoice'>Collection:&nbsp;</label>
            <select id='colChoice' onChange={(e) => this.onCollectionChanged(e)}>
                {this.getOptions('kreuzwort')}
                {this.getOptions('taboo')}
                {this.getOptions('simpleQuestion')}
            </select><br />
            <label for='key'>Key If Editing/Deleting Existing Question:&nbsp;</label>
            <input className="rounded  bg-secondary text-white" type='text' id='key' onChange={(e) => this.onKeyChanged(e)} placeholder="Input Key" /><br />
            <button type="button" class="btn btn-secondary" onClick={e => this.onNew(e)}>New Question</button>
            <button type="button" class="btn btn-secondary" onClick={e => this.onEdit(e)}>Edit Question</button>
            <button type="button" class="btn btn-secondary" onClick={e => this.onDelete(e)}>Delete Question</button><br /><br />
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
                {this.getComponent()}
            </div>
        )
    }
}

export default ContributorChoice;