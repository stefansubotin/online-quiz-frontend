import Stone from "./Stone"
import React, { Component } from "react";

class Feld extends Component {
    constructor(props) {
        super(props);

        this.rows = props.rows
        this.isUserActive = props.isUserActive
    }


    render() {
        return (
            <div name="dominoRows" id="dominoRows" className="dominoRows rounded container flex-wrap">
                {(this.state.rows.map((row) => {
                    return (
                        <div className="row flex-wrap " id={row.id}>
                            {row.columns.map((f) => {
                                return (
                                    <div onDrop={(e) => this.props.handleDrop(e)} onDragOver={(e) => this.props.handleDragOver(e)} className="flex-wrap zelle col-2" id={f.id}>
                                        {(f.stone.id == "") ? f.id :
                                            <Stone
                                                isUserActive={this.isUserActive}
                                                stone={f.stone}
                                                handleDragStart={this.props.handleDragStart(e)}
                                                handleRotateStone={(e) => this.props.handleRotateStone(e)}
                                            />
                                        }
                                    </div>

                                );
                            })}
                        </div>
                    );
                }))}
            </div>
        )
    }
}
export default Feld