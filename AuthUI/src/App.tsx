import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { OAuthConsent } from "./pages/OAuthConsent";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Show Home component at root URL */}
        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/oauth/consent" element={<OAuthConsent />} />
      </Routes>
    </BrowserRouter>
  );
}
