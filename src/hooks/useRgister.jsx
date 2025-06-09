import React, { useState } from "react";

function useRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passVerification, setPassVerification] = useState("");
  const [isRegistSucceed, setIsRegistSucceed] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    try {
      const response = await fetch(`http://localhost:3005/users?username=${username}`);
      const data = await response.json();

      if (data.length > 0) {
        setError("Name already taken");
        setIsRegistSucceed(false);
        return;
      }

      if (password === passVerification) {
        setIsRegistSucceed(true);
        setError("");
        localStorage.setItem("currentUser", username);
      } else {
        setError("Password confirmation doesn't match");
      }

    } catch (err) {
      console.error("Error registering user:", err);
      setError("An error occurred while registering.");
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    passVerification,
    setPassVerification,
    isRegistSucceed,
    error,
    register,
  };
}

export default useRegister;
