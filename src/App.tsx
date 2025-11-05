// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { Home } from "./screens/Home/Home";
import { CompanyDetailPage } from "./screens/CompanyDetail/CompanyDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company/:id" element={<CompanyDetailPage />} />
    </Routes>
  );
}

export default App;