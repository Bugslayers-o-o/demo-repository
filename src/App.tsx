/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Therapy from "./pages/Therapy";
import Chat from "./pages/Chat";
import Professionals from "./pages/Professionals";
import Wellness from "./pages/Wellness";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f0] font-sans selection:bg-[#5A5A40]/20">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/therapy" element={<Therapy />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/wellness" element={<Wellness />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

