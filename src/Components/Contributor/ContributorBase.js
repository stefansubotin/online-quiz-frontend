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

    handleCallBack = (childData) => {
        this.setState({
            list: childData.list
        })
    }

    getDisplay() {
        let display = [];
        display.push(<ContributorChoice parentCallback={this.handleCallBack} />);
        if (this.state.list) {
            display.push(<br/>);
            display.push(<ContributorList />);
        }
    }

    render(){
        return (
            <div>
                {this.getDisplay()}
            </div>
        )
    }
}

export default ContributorBase;