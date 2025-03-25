import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/home";
import VTO from "./pages/vto";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vto" element={<VTO />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);

// Service worker functionality can be added back if needed
