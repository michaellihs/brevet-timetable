import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route, Navigate, HashRouter} from "react-router-dom";

import {App} from "./components/app";
import Widget from "./routes/widget"


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/timetable" />} />
            <Route path="/timetable" element={<App />}></Route>
            <Route path="/timetable/widget/:eventId"  element={<Widget />} />
        </Routes>
    </HashRouter>
);
