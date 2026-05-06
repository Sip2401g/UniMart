import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CollegeHeadRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "college_head") return <Navigate to="/" replace />;

  return children;
};

export default CollegeHeadRoute;
