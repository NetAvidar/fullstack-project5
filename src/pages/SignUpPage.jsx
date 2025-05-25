import React , {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRgister";
import "../css/signUp.css"

function SignUpPage() {

  const navigate = useNavigate();
  const 
   {  username,
      setUsername,
      password,
      setPassword,
      passVerification,
      setPassVerification,
      isRegistSucceed,
      error,
      register}  = useRegister();


  useEffect(()=>{
    if(isRegistSucceed){
      navigate("/complete-register");
    }
  }, [navigate, isRegistSucceed]);


  const handleSubmit = (event) => {
    event.preventDefault();
    register();
  };


  const handleSendToRegister = (e) => {
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up Page</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        /><br/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        /><br/>
        <input
          type="password"
          name="password"
          placeholder="Password Verification"
          value={passVerification}
          onChange={(e) => setPassVerification(e.target.value)}
          className="signup-input"
        /><br/>

        <button type="submit" className="signup-button">Register</button>
        <button onClick={handleSendToRegister} className="switch-to-login-button" >Already signed up</button><br/>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SignUpPage;

