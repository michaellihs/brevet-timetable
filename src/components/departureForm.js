import React from 'react';
import {Form, Row, Col, Button} from "react-bootstrap";

export class DepartureForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departure: "2024-08-16 20:10",
            timeLimit: "134:00"
        }
    }

    componentDidMount() {
        this.setState({
            departure: this.props.initialDeparture,
            timeLimit: this.props.initialTimelimit,
        });
    }

    handleDepartureChange = (e) => {
        this.setState({departure: e.target.value});
    }

    handleTimeLimitChange = (e) => {
        this.setState({timeLimit: e.target.value});
    }

    render() {
        return (
            <Form>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"formDeparture"}>
                            <Form.Label>Departure</Form.Label>
                            <Form.Control
                                onChange={this.handleDepartureChange}
                                // onBlur={() => this.props.updateDepartureHandler(this.state.departure)}
                                placeholder={"2024-08-10 20:10"}
                                className={"w-50"}
                                defaultValue={this.props.initialDeparture}
                            />
                            <Form.Text className={"text-muted"}>
                                Please provide the start date and start time in 'yyyy-mm-dd hh:mm'
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"formLimit"}>
                            <Form.Label>Time Limit (in hours)</Form.Label>
                            <Form.Control
                                onChange={this.handleTimeLimitChange}
                                placeholder={"134:00"}
                                className={"w-50"}
                                defaultValue={this.props.initialTimelimit}
                            />
                            <Form.Text className={"text-muted"}>
                                Please provide the max time limit for the event (in hours)
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"}>
                            <Button variant={"primary"} onClick={() => this.props.updateStartTimeAndTimeLimitHandler(this.state.departure, this.state.timeLimit)}>{"Apply"}</Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        );
    }
}