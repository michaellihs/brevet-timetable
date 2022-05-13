import React from 'react';
import {Form} from 'react-bootstrap';

export class TtField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        }
    }

    componentDidMount() {
        this.setState({inputValue: this.props.inputValue});
    }

    handleChange = (e) => {
        this.setState({inputValue: e.target.value});
    }

    render() {
        return (
            <div className={"input-group"} aria-label={"input"}>
                <Form.Control
                    onBlur={() => this.props.updateInputHandler(this.props.stage, this.props.field, this.state.inputValue)}
                    onChange={this.handleChange}
                    defaultValue={this.props.inputValue}
                    className={this.props.unit && "text-end"}
                    aria-label="form"
                />
                {this.props.unit && <div data-testid={"unit-indicator"} aria-label={"unit-indicator"} className="input-group-append">
                    <span data-testid={"unit-span"} className="input-group-text">{this.props.unit}</span>
                </div>}
            </div>
        );
    }

}