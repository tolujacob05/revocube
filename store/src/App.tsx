import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/user/Footer";
import Landing from "./components/user/Landing";
import Main from "./components/user/Main";

function App() {
  return (
    <div className="space-y-10 pt-5 md:pt-10">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/category/:category" element={<Main />} />
        </Routes>
      </Router>

      <div className="pt-20">
        <Footer />
      </div>
    </div>
  );
}

export default App;
