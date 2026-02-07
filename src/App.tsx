import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardPage from './pages/DashboardPage';
import PostDetailPage from './pages/PostDetailPage';
import EventsPage from './pages/EventsPage';
import PostsPage from './pages/PostsPage';
import ProfilePage from './pages/ProfilePage';
import EventDetailAdminPage from './pages/EventDetailAdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/admin" element={
          <ProtectedRoute requireCommittee>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/event/:id/admin" element={
          <ProtectedRoute requireCommittee>
            <EventDetailAdminPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/post/:id" element={
          <ProtectedRoute>
            <PostDetailPage />
          </ProtectedRoute>
        } />
        
        <Route path="/events" element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/posts" element={
          <ProtectedRoute>
            <PostsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;