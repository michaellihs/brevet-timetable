import React from 'react';
import {getTimetableFromStages} from '../domain/calculation';

export class ArrivalTimes extends React.Component {
    render() {
        const stages = this.props.stages;
        const startTime = this.props.params.startTime;
        const timeLimit = this.props.params.timeLimit;
        const minutesPerKm = this.props.params.minutesPerKm;
        const climbPerHour = this.props.params.climbPerHour;
        const timetable = getTimetableFromStages(stages, startTime, timeLimit, minutesPerKm, climbPerHour);
        const days = this.getDaysFromTimetable(timetable);

        return (
            <table className={"table"}>
                <thead>
                <tr>
                    <th></th>
                    {days.map((day, index) => {
                        return <th key={index}>{day}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {timetable.map((stage, index) => {
                    return (
                        <tr key={index}>
                            <td><strong>{stage.to}</strong></td>
                            {days.map((day, index) => {
                                const sleep = (stage.pause > 60) ? "😴" : "";
                                const arrivalOnDay = (day === stage.arrival.weekdayShort) ? stage.arrival.toFormat("HH:mm") + " " + sleep : "";
                                return (
                                    <td key={index}>{arrivalOnDay}</td>
                                );
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        );
    }

    getDaysFromTimetable(stages) {
        var days = [];
        stages.forEach((stage) => {
            let weekday = stage.arrival.weekdayShort;
            if (!days.includes(weekday)) {
                days.push(weekday);
            }
        });
        return days;
    }
}