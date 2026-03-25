import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginRedirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuth();

  const location = useLocation();
  // Extract 'from' from query params or fallback to the location.state
  //console.log("User authenticated and redirected to:", from);
  useEffect(() => {
    const accessToken = params.get("accessToken");
    const name = params.get("name");
    const email = params.get("email");
    const from = params.get("from");

    console.log("Received params:", { accessToken, name, email, from });

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    // If the user is already authenticated, no need to set auth again
    if (isAuthenticated) {
      console.log("isAuthenticated is true, navigating to:", from);
      navigate(from, { replace: true });
      return;
    }

    // Set auth state
    setAuth({
      accessToken,
      user: { name, email },
    });

    // Redirect after setting auth state
    navigate(from, { replace: true });
  }, [
    params.get("accessToken"),
    params.get("name"),
    params.get("email"),
    navigate,
    setAuth,
    isAuthenticated,
  ]); // Use specific params for dependency

  return (
    <div className="flex justify-center items-center h-screen">
      <span className="text-gray-600">Redirecting...</span>
    </div>
  );
}
