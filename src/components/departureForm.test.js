import React from 'react';
import {DepartureForm} from "./departureForm";
import {prettyDOM, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'

describe('departureForm', () => {
  it('should render the form for entering the departure time', () => {
    //given
    const departure = "2022-08-07 12:45"
    const timeLimit = "125:00"
    //when
    render(<DepartureForm departure={departure} timeLimit={timeLimit} />);
    //then
    const departureInput = screen.getByRole("textbox", {name: "Departure"});
    expect(departureInput).toBeInTheDocument()
    const timeLimitInput = screen.getByRole("textbox", {name: "Time Limit (in hours)"});
    expect(timeLimitInput).toBeInTheDocument()
    expect(screen.getByRole("button", {name: "Apply"})).toBeInTheDocument()
  });

});
