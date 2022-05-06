import React from 'react';
import {Button, Form, Row} from 'react-bootstrap';
import {Stage} from './stage';
import * as PropTypes from 'prop-types';

export class StagesForm extends React.Component {
    render() {
        return <Form>
            <Row className={"mx-0"}>
                <table className="table timetable">
                    <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Distance</th>
                        <th>Climb</th>
                        <th>Pause</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderStages(this.props.stages)}
                    {this.renderNewStage()}
                    </tbody>
                </table>
            </Row>
        </Form>;
    }

    renderStages(stages) {
        return stages.map((stage) => {
            return (
                <Stage
                    key={stage.id}
                    id={stage.id}
                    updateInputHandler={(stage, field, value) => this.props.updateInputHandler(stage, field, value)}
                    clickRemoveStageHandler={(stageId) => this.props.removeStageHandler(stageId)}
                    value={stage}
                />
            );
        });
    }

    renderNewStage() {
        return (
            <tr>
                <td>
                    <div className={"input-group"}>
                        <Form.Control placeholder={"Start CP"} id={"input_from"}/>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control placeholder={"Destination CP"} id={"input_to"}/>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control className={"text-end"} placeholder={"123"} id={"input_distance"}/>
                        <div className="input-group-append">
                            <span className="input-group-text">km</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control className={"text-end"} placeholder={"1200"} id={"input_climb"}/>
                        <div className="input-group-append">
                            <span className="input-group-text">m</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div className={"input-group"}>
                        <Form.Control className={"text-end"} placeholder={"30"} id={"input_pause"}/>
                        <div className="input-group-append">
                            <span className="input-group-text">min</span>
                        </div>
                    </div>
                </td>
                <td>
                    <Button variant={"success"} onClick={() => this.props.addStageHandler}>{"Add Stage"}</Button>
                </td>
            </tr>
        );
    }
}


StagesForm.propTypes = {
    stages: PropTypes.array,
    updateInputHandler: PropTypes.func,
    addStageHandler: PropTypes.func,
    removeStageHandler: PropTypes.func,
};
