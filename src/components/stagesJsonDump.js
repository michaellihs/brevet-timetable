import React from 'react';
import {Col, Form, Row} from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import {generatePath} from "react-router-dom";
import {DEFAULT_AVERAGES} from "../util/constants";
import {AlertEmptyStages} from "./alerts";

export class StagesJsonDump extends React.Component {
    render() {
        const stages = this.props.stages;
        if (stages === null || stages.length === 0) {
            return (<AlertEmptyStages />);
        }

        const iframeWidgetPath = generatePath("/#/timetable/widget/:eventId?averages=:averages&startTime=:startTime&timeLimit=:timeLimit", {
            eventId: encodeURIComponent(this.props.selectedEvent),
            averages: DEFAULT_AVERAGES,
            startTime: encodeURIComponent(this.props.startTime),
            timeLimit: this.props.timeLimit
        })
        return <Form data-testid={"export-form"}>
            <Form.Group className={"mb-3"}>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>JSON dump of stages</Form.Label>
                            <div className="input-group">
                                <input id="jsonDump" type="text" className="form-control" readOnly={true}
                                       value={JSON.stringify(stages)}/>
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" id="copy-button-json"
                                            data-toggle="tooltip" data-placement="button"
                                            title="Copy to Clipboard"
                                            onClick={() => this.props.copyToClipboardHandler("jsonDump")}
                                    >Copy</button>
                                </span>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Link to this event</Form.Label>
                            <div className="input-group">
                                <input id="eventUrl" type="text" className="form-control" readOnly={true}
                                       value={`${window.location.protocol}//${window.location.host}/timetable?event=${encodeURIComponent(this.props.selectedEvent)}`}
                                       placeholder="Some path"/>
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" id="copy-button-link"
                                            data-toggle="tooltip" data-placement="button"
                                            title="Copy to Clipboard"
                                            onClick={() => this.props.copyToClipboardHandler("eventUrl")}
                                    >Copy</button>
                                </span>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>iFrame code</Form.Label>
                            <div className="input-group">
                                <input id="iframeCode" type="text" className="form-control" readOnly={true}
                                       value={`<iframe src="${window.location.protocol}//${window.location.host}/timetable${iframeWidgetPath}"></iframe>`}/>
                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" id="copy-button-iframe"
                                            data-toggle="tooltip" data-placement="button"
                                            title="Copy to Clipboard"
                                            onClick={() => this.props.copyToClipboardHandler("iframeCode")}
                                    >Copy</button>
                                </span>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </Form.Group>
        </Form>;
    }
}

StagesJsonDump.propTypes = {
    stages: PropTypes.array,
    onClick: PropTypes.func
};
