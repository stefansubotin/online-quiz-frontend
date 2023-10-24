import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorSimpleQuestion extends Component {
    constructor(props){
        super(props);
        this.state = {
            collection: props.collection,
            key: props.key,
            data: ''
        }
    }

    render() {
        return <div>Placeholder</div>
    }
}

export default ContributorSimpleQuestion