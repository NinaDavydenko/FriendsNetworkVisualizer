import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeopleGrid from "./pages/PeopleGridPage";
import PersonDetailsPage from "./pages/PersonDetailsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PeopleGrid />} />
        <Route path="/people/:id" element={<PersonDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
