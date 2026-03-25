import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Reusable auth guard for actions (not routes)
 *
 * @returns {function} requireAuth - call this before protected actions
 */
export default function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (options = {}) => {
    const {
      redirectTo = "/login",
      closeUI, // optional callback (cart drawer, modal, etc.)
      replace = false,
    } = options;

    if (isAuthenticated) return true;

    if (closeUI) closeUI();

    navigate(redirectTo, {
      replace,
      state: { from: location },
    });

    return false;
  };

  return requireAuth;
}
