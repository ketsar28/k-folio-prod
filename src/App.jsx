/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
function App() {
  return (
    <>
      <Routes>
        <Route exact path={"home"} element={<Navigate to="/" />} />
        <Route exact path={"/"} element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
