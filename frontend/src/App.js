import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // Import the new page
import AdminDashboard from './pages/AdminDashboard';
import PassengerDashboard from './pages/PassengerDashboard';
import ConductorDashboard from './pages/ConductorDashboard';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/passenger" element={<PassengerDashboard />} />
          <Route path="/conductor" element={<ConductorDashboard />} />
        </Routes>
      </Router>

  );
}

export default App;
