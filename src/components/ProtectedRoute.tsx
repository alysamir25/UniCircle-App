import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCommittee?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireCommittee = false, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { user, isLoading, isCommittee, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If admin-only route but user is not admin
    if (isCommittee) {
      // Committee members go to admin dashboard
      return <Navigate to="/admin" replace />;
    } else {
      // Regular members go to user dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (requireCommittee && !isCommittee) {
    // If committee-only route but user is not committee/admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;