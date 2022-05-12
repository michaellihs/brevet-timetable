import React from 'react';
import {Form, Row, Col, Button} from "react-bootstrap";

export class DepartureForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departure: "2022-08-07 12:45",
            timeLimit: "125:00"
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
                                placeholder={"2022-08-05 12:45"}
                                className={"w-50"}
                                defaultValue={this.props.initialDeparture}
                            />
                            <Form.Text className={"text-muted"}>
                                Please provide the start date and start time in 'jjjj-mm-dd hh:mm'
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className={"mb-3"} controlId={"formLimit"}>
                            <Form.Label>Time Limit</Form.Label>
                            <Form.Control
                                onChange={this.handleTimeLimitChange}
                                placeholder={"125:00"}
                                className={"w-50"}
                                defaultValue={this.props.initialTimelimit}
                            />
                            <Form.Text className={"text-muted"}>
                                Please provide the max time limit for the event
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