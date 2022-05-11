import React from 'react';
import {Button, Col, Form, Row} from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import events from '../events';


export class EventSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newEventName: ''
        }
    }

    render() {
        return (
            <Form>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Select existing event</Form.Label>
                            <Form.Select value={this.props.selectedEvent} onChange={this.props.onChange}>
                                {Array.from(events).map(([eventName, _]) => {
                                    return (<option key={eventName} value={eventName}>{eventName}</option>);
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"newEvent"}>
                            <Form.Label>Create new event</Form.Label>
                            <Form.Control
                                onChange={this.handleNewEventNameChange}
                                placeholder={"Event name"}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"}>
                            <Button variant={"success"} onClick={() => this.props.createNewEventHandler(this.state.newEventName)}>{"Create event"}</Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        );
    }

    handleNewEventNameChange = (e) => {
        this.setState({newEventName: e.target.value});
    }
}

EventSelector.propTypes = {
    selectedEvent: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    createNewEventHandler: PropTypes.func,
};
