import React from 'react';
import {TtField} from "./ttField";
import {Button} from "react-bootstrap";

export class Stage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr key={this.props.id}>
                <td>
                    <TtField
                        field={"from"}
                        stage={this.props.id}
                        inputValue={this.props.value.from}
                        updateInputHandler={this.props.updateInputHandler}
                    />
                </td>
                <td>
                    <TtField
                        field={"to"}
                        stage={this.props.id}
                        inputValue={this.props.value.to}
                        updateInputHandler={this.props.updateInputHandler}
                    />
                </td>
                <td>
                    <TtField
                        field={"distance"}
                        stage={this.props.id}
                        inputValue={this.props.value.distance}
                        updateInputHandler={this.props.updateInputHandler}
                        unit={"km"}
                    />
                </td>
                <td>
                    <TtField
                        field={"climb"}
                        stage={this.props.id}
                        inputValue={this.props.value.climb}
                        updateInputHandler={this.props.updateInputHandler}
                        unit={"m"}
                    />
                </td>
                <td>
                    <TtField
                        field={"pause"}
                        stage={this.props.id}
                        inputValue={this.props.value.pause}
                        updateInputHandler={this.props.updateInputHandler}
                        unit={"min"}
                    />
                </td>
                <td>
                    <Button onClick={() => this.props.clickRemoveStageHandler(this.props.id)}
                            variant={"danger"}>{"Remove Stage"}</Button>
                </td>
            </tr>
        );
    }
}