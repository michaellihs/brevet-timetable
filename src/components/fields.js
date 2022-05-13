import {Duration} from "luxon";
import {DATE_DD_MM__HH_MM} from "../util/date";

export function DistanceField(props) {
    return ((withTwoDigits(props.value)) + " km");
}
export function SpeedField(props) {
    return ((withTwoDigits(props.value)) + " km/h");
}

export function DurationField(props) {
    return (Duration.fromMillis(Number(props.value) * 60 * 1000).toFormat("hh:mm"))
}

export function TimeField(props) {
    return props.value.toFormat(DATE_DD_MM__HH_MM);
}

function withTwoDigits(value) {
    return value.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        useGrouping: false
    });
}
