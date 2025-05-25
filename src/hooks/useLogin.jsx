import { useState } from "react";

function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const login = () => {
    fetch(`http://localhost:3005/users?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setError("User not found");
          setIsLoggedIn(false);
          return;
        }

        const user = data[0];

        if (user.website === password) {
          setIsLoggedIn(true);
          setError("");
          localStorage.setItem("currentUser", username);
        } else {
          setError("Incorrect password");
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        setError("Error fetching user data");
        setIsLoggedIn(false);
      });
  };

  return { username, setUsername, password, setPassword, isLoggedIn, error, login };
}

export default useLogin;
