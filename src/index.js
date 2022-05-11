import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import {App} from "./components/app";
import Widget from "./routes/widget"


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/timetable" element={<App />}></Route>
            <Route path="/timetable/widget">
                <Route path={":eventId"}  element={<Widget />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
