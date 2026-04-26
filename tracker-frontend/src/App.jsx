import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import DsaTracker from './pages/DsaTracker';
import Journal from './pages/Journal';
import Login from './pages/Login';
import Register from './pages/Register';

// Protects any route — redirects unauthenticated users to /login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="dsa" element={<DsaTracker />} />
            <Route path="journal" element={<Journal />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;