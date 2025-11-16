import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import GroupChat from "./pages/GroupChat.jsx";
import "./index.css";

import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>
          {/* Main app with tabs */}
          <Route path="/" element={<App />} />

          {/* Dynamic group chat route */}
          <Route path="/chat/:groupName" element={<GroupChat />} />
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  </React.StrictMode>
);
