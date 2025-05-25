import React, { useState} from "react";

 function useRegister (key, initialValue){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passVerification, setPassVerification] = useState("");
    const [isRegistSucceed , setIsRegistSucceed] = useState(false);
    const [error, setError] = useState("");

    const register = () => {
        const savedPassword = localStorage.getItem(username);
        if (savedPassword != null) {
            setError("Name already taken");
            return;
        }

        if (password === passVerification) {
            localStorage.setItem(username, password);
            setIsRegistSucceed(true);
            setError("");
            localStorage.setItem('currentUser',username);
        } else {
            setError("Password confirmation doesn't match");
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