import {DateTime} from "luxon";

export const TIME_FORMAT = "HH:mm";
export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";

export function getDateTime(string) {
    return DateTime.fromFormat(string, DATE_TIME_FORMAT);
}

export function timeFromDateTime(dateTime) {
    return dateTime.toFormat(TIME_FORMAT);
}

export function weekdayFromDateTime(dateTime) {
    return dateTime.toFormat("cccc");
}