import React from 'react';
import {Form} from 'react-bootstrap';
import * as PropTypes from 'prop-types';

export class StagesJsonDump extends React.Component {
    render() {
        return <Form>
            <Form.Group className={"mb-3"}>
                <Form.Label>JSON dump of stages</Form.Label>
                <div className="input-group">
                    <input id="jsonDump" type="text" className="form-control" readOnly={true}
                           value={JSON.stringify(this.props.stages)}/>
                    <span className="input-group-btn">
                        <button className="btn btn-primary" type="button" id="copy-button"
                                data-toggle="tooltip" data-placement="button"
                                title="Copy to Clipboard"
                                onClick={this.props.onClick}
                        >Copy</button>
                    </span>
                </div>
            </Form.Group>
        </Form>;
    }
}

StagesJsonDump.propTypes = {
    stages: PropTypes.array,
    onClick: PropTypes.func
};
