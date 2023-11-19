
import React, { Component } from "react";

class Feld extends Component {
    constructor(props) {
        super(props);
        this.handleDragOver = props.handleDragOver
        this.handleDrop = props.handleDrop

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
                                    <div onDrop={(e) => this.handleDrop(e)} onDragOver={(e) => this.handleDragOver(e)} className="flex-wrap zelle col-2" id={f.id}>
                                        {(f.stone.id == "") ? f.id :
                                            <span>Hallo</span>
                                        }
                                    </div>

                                );
                            })}
                        </div>
                    );
                }))
                }
            </div >
        )
    }
}
export default Feld