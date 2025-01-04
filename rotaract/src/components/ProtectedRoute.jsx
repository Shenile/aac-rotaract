import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.user_type !== role) {
      navigate('/', { replace: true });
    }
  }, [navigate, user, role]);

  return <>{children}</>;
};

export default ProtectedRoute;
