import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
         navigate("/home");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <h2>Login Page</h2>
    </div>
  );
}

export default LoginPage;
