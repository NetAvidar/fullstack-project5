import React, { useState} from "react";

 function useLogin(key, initialValue){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState("");

    const login = () => {

        const savedPassword = localStorage.getItem(username);
        if (savedPassword === null) {
            setError("User not found");
            return;
        }

        if (savedPassword === password) {
            setIsLoggedIn(true);
            setError("");
            localStorage.setItem('currentUser',username);
        } else {
            setError("Incorrect username or password");
        }   
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        isLoggedIn,
        error,
        login,
  };
}

export default useLogin;