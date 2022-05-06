import React from 'react';
import {Alert, Button, Col, Form, Row} from 'react-bootstrap';
import * as PropTypes from 'prop-types';

export class CalculationParameters extends React.Component {
    render() {
        return <Form>
            <Row>
                <Col>
                    <Form.Group className={"mb-3"} controlId={"minutesPerKm"}>
                        <Form.Label>Minutes / km</Form.Label>
                        <Form.Control
                            placeholder={"2"}
                            defaultValue={this.props.minutesPerKmDefaultValue}
                        />
                        <Form.Text className={"text-muted"}>
                            How many minutes do you need per kilometer
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className={"mb-3"} controlId={"climbPerHour"}>
                        <Form.Label>m / h</Form.Label>
                        <Form.Control
                            placeholder={"2"}
                            defaultValue={this.props.climbPerHourDefaultValue}
                        />
                        <Form.Text className={"text-muted"}>
                            How many meters do you climb per hour
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Alert variant={"success"}>
                        The duration per stage is calculated as:
                        <pre>(distance * minutesPerKm) + (climb / climbPerHour * 60)</pre>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className={"mb-3"}>
                        <Button variant={"primary"}
                                onClick={this.props.updateHandler}>{"Apply"}</Button>
                    </Form.Group>
                </Col>
            </Row>
        </Form>;
    }
}

CalculationParameters.propTypes = {
    minutesPerKmDefaultValue: PropTypes.any,
    climbPerHourDefaultValue: PropTypes.any,
    updateHandler: PropTypes.func
};