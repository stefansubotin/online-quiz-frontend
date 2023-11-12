import Stone from "./Stone"


class Feld extends Component {
    constructor(props) {
        super(props);

        this.rows = props.rows,
            this.handleDragOver = props.handleDragOver,
            this.handleDrop = props.handleDrop,
            this.isUserActive = props.isUserActive,
            this.handleDragStart = props.handleDragStart,
            this.handleRotateStone = props.handleRotateStone

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
                                            <Stone
                                                isUserActive={this.isUserActive}
                                                stone={f.stone}
                                                handleDragStart={this.handleDragStart()}
                                                handleRotateStone={this.handleRotateStone()}
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