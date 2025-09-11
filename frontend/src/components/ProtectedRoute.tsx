import React from "react";
import { Navigate } from "react-router-dom";

interface protectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<protectedRouteProps> = ({children}) => {
  const token = localStorage.getItem("token");
  if(!token){
    return <Navigate to="/login" replace/>
  }
  return <>{children}</>
}

export default ProtectedRoute;