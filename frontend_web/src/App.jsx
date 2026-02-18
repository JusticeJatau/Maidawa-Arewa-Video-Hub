import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Categories from './pages/Categories';
import Users from './pages/Users';
import AdminRoute from './components/AdminRoute';
import EditVideo from './pages/EditVideo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AdminRoute><Dashboard/></AdminRoute>} />
          <Route path="videos" element={<AdminRoute><Videos /></AdminRoute>} />
          <Route path="categories" element={<AdminRoute><Categories /></AdminRoute>} />
          <Route path="users" element={<AdminRoute><Users/></AdminRoute>} />
          <Route path="videos/edit/:videoId" element={<AdminRoute><EditVideo/></AdminRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;