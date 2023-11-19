import React, { Component } from "react";
import ContributorChoice from "./ContributorChoice";
import ContributorList from "./ContributorList";

class ContributorBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: false
        }
    }

    onList(event) {
        this.setState({
            list: !this.state.list
        })
    }

    getDisplay() {
        let display = [];
        let list = 'Display Question List';
        if (this.state.list) list = 'Hide Question List'
        display.push(<ContributorChoice parentCallback={this.handleCallBack} list={this.state.list} />);
        display.push(<br />);
        display.push(<button style={{ margin: '10px' }} type="button" class="btn btn-secondary" onClick={(e) => this.onList(e)}>{list}</button>)
        if (this.state.list) {
            display.push(<br />);
            display.push(<ContributorList />);
        }
        return display;
    }

    render() {
        return (
            <div>
                {this.getDisplay()}
            </div>
        )
    }
}

export default ContributorBase;