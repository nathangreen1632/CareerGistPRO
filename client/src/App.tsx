// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppliedTo from './pages/AppliedTo';
import SavedJobs from './pages/SavedJobs';
import Login from './pages/Login';
import Register from './pages/Register';
import Error from './pages/Error';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps ALL normal pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="applied"
            element={
              <ProtectedRoute>
                <AppliedTo />
              </ProtectedRoute>
            }
          />
          <Route
            path="saved"
            element={
              <ProtectedRoute>
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
