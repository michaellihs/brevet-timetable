import React from 'react';
import {Duration} from 'luxon';
import {Button, Form} from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import {getTimetableFromStages} from '../domain/calculation';


function DistanceField(props) {
    return (props.value.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: false
    }) + " km");
}

function SpeedField(props) {
    return (props.value.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: false
    }) + " km/h");
}

function DurationField(props) {
    return (Duration.fromMillis(props.value * 60 * 1000).toFormat("hh:mm"))
}

function TimeField(props) {
    return props.value.toFormat("dd.LL. HH:mm");
}

export class Timetable extends React.Component {
    render() {
        return (
            <>
                <table className="table tr-hover" id={"calcTable"}>
                    <colgroup>
                        {
                            [...Array(11).keys()].map(index => {
                                const cssClass = (index !== 0) ? ((index % 2 === 1) ? 'col-bg-lightgray' : 'col-bg-darkgray') : '';
                                return (<col key={index} span={1} className={cssClass} />);
                            })
                        }
                    </colgroup>
                    <thead key={"thead"}>
                        <tr key={"thead-tr"}>
                            <th key={"stage"} className={"col-2"}>stage</th>
                            <th key={"departure align-right"} className={"col-1"}>departure</th>
                            <th key={"arrival align-right"} className={"col-1"}>arrival</th>
                            <th key={"stagedistance align-right"} className={"col-1"}>stage distance</th>
                            <th key={"totaldistance align-right"} className={"col-1"}>total distance</th>
                            <th key={"stageclimb align-right"} className={"col-1"}>stage climb</th>
                            <th key={"totalclimb align-right"} className={"col-1"}>total climb</th>
                            <th key={"pause align-right"} className={"col-1"}>pause</th>
                            <th key={"stagetime align-right"} className={"col-1"}>stage time</th>
                            <th key={"totaltime align-right"} className={"col-1"}>total time</th>
                            <th key={"average align-right"} className={"col-1"}>average</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.renderStagesStatic(this.props.stages, this.props.departure, this.props.minutesPerKm, this.props.climbPerHour)}
                    </tbody>
                </table>
                <Form.Group className={"mb-3"}>
                    <Button variant={"success"} onClick={() => this.props.excelExport("calcTable")}>{"Excel export"}</Button>
                </Form.Group>
            </>
        );
    }

    renderStagesStatic(stages, departure, minutesPerKm, climbPerHour) {
        const alignRight = {
            textAlign: 'right'
        };

        const calculatedStages = getTimetableFromStages(stages, departure, 0, minutesPerKm, climbPerHour)

        return calculatedStages.map((stage, index) => {
            return (
                <tr key={stage.id}>
                    <td className={"col-2"}><strong >{stage.from} - {stage.to}</strong></td>
                    <td className={"col-1"} style={alignRight}><TimeField value={stage.arrival} /></td>
                    <td className={"col-1"} style={alignRight}><TimeField value={stage.departure} /></td>
                    <td className={"col-1"} style={alignRight}><DistanceField value={stage.distance}/></td>
                    <td className={"col-1"} style={alignRight}><DistanceField value={stage.totalDistance}/></td>
                    <td className={"col-1"} style={alignRight}>{stage.climb} m</td>
                    <td className={"col-1"} style={alignRight}>{stage.totalClimb} m</td>
                    <td className={"col-1"} style={alignRight}><DurationField value={stage.pause} /></td>
                    <td className={"col-1"} style={alignRight}><DurationField value={stage.duration} /></td>
                    <td className={"col-1"} style={alignRight}><DurationField value={stage.totalTime} /></td>
                    <td className={"col-1"} style={alignRight}><SpeedField value={stage.average} /></td>
                </tr>
            );
        });
    }
}

Timetable.propTypes = {
    stages: PropTypes.array,
    departure: PropTypes.string,
    minutesPerKm: PropTypes.number,
    climbPerHour: PropTypes.number,
    excelExport: PropTypes.func,
};
