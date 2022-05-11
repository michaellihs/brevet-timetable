import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {createRoot} from "react-dom/client";
import { act } from "react-dom/test-utils";

import {TtField} from "./ttField";

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

it("renders with or without a unit", () => {
    const blurHandler = () => {}

    const root = createRoot(container);
    root.render(<TtField updateInputHandler={() => blurHandler()} />);

    expect(container.textContent).toBe("");

    root.render(<TtField unit={'km'} />);

    expect(container.textContent).toBe("");
});