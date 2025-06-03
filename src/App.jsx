/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <Routes>
        <Route exact path={"home"} element={<Navigate to="/" />} />
        <Route exact path={"/"} element={<HomePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
