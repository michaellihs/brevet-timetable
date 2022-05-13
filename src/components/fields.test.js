import '@testing-library/jest-dom';
import {DistanceField, DurationField, SpeedField, TimeField} from "./fields";
import {DateTime} from "luxon";
import {DATE_TIME_FORMAT} from "../util/date";


describe("fields", () => {
    describe("DistanceField", () => {
        it("renders exactly 2 digits when 0 digits are given", () => {
            expect(DistanceField({value: 2})).toEqual("2.00 km");
        });

        it("renders exactly 2  digits when 2 digits are given", () => {
           expect(DistanceField({value: 3.01})).toEqual("3.01 km")
        });

        it("renders exactly 2  digits when more than 2 digits are given", () => {
           expect(DistanceField({value: 4.00111})).toEqual("4.00 km")
        });

        it("renders expected value when number is given as a string", () => {
            expect(DistanceField({value: "4.12"})).toEqual("4.12 km");
        })
    });

    describe("SpeedField", () => {
        it("renders exactly 2 digits when 0 digits are given", () => {
            expect(SpeedField({value: 2})).toEqual("2.00 km/h");
        });

        it("renders exactly 2  digits when 2 digits are given", () => {
           expect(SpeedField({value: 3.01})).toEqual("3.01 km/h")
        });

        it("renders exactly 2  digits when more than 2 digits are given", () => {
           expect(SpeedField({value: 4.00111})).toEqual("4.00 km/h")
        });

        it("renders expected value when number is given as a string", () => {
            expect(SpeedField({value: "4.12"})).toEqual("4.12 km/h");
        })
    });

    describe("DurationField", () => {
       it("shows expected value for numeric value", () => {
           expect(DurationField({value: 60})).toEqual("01:00");
       });

       it("shows expected value for string value", () => {
           expect(DurationField({value: "60"})).toEqual("01:00");
       });
    });

    describe("TimeField", () => {
        it("shows expected time for given value", () => {
            const dateTime = DateTime.fromFormat("2022-08-07 12:45", DATE_TIME_FORMAT);
            expect(TimeField({value: dateTime})).toEqual("07.08. 12:45");
        });
    });
});
