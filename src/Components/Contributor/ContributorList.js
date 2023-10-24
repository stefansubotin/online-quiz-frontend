import React, { Component } from "react";
import BackendAccess from "../../Tools/BackendAccess";

class ContributorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullList: '',
            filterKreuzwort: true,
            filterSimpleQuestion: false,
            filterTaboo: false,
        }
    }

    getListToDisplay(){
        let dat = JSON.parse(this.state.fullList);
        if (!this.state.filterKreuzwort && !this.state.filterSimpleQuestion && !this.state.filterTaboo) return dat.results;
        let lst = [];
        for (let i = 0; i < dat.results.length; i++){
            if (this.state.filterKreuzwort && dat.results[i].collection == 'kreuzwort') lst.push(dat.results[i]);
            if (this.state.filterTaboo && dat.results[i].collection == 'taboo') lst.push(dat.results[i]);
            if (this.state.filterSimpleQuestion && dat.results[i].collection == 'simpleQuestion') lst.push(dat.results[i]);
        }
        return lst;
    }

    getTableRows(){
        
        
    }

    getDisplayTable(){
        
    }

    async componentDidMount(){
        const response = await fetch(BackendAccess.getUrlContributor());
        const items = await response.json();

        this.setState({
            fullList: JSON.stringify(items),
            filterKreuzwort: this.state.filterKreuzwort,
            filterSimpleQuestion: this.state.filterSimpleQuestion,
            filterTaboo: this.state.filterTaboo,
        });
    }

    render() {
        return (
            <></>
        )
    }
}

export default ContributorList