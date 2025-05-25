import React , {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useRgister";

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
    <div>
      <h2>Sign Up Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <input
          type="password"
          name="password"
          placeholder="Password Verification"
          value={passVerification}
          onChange={(e) => setPassVerification(e.target.value)}
        /><br/>
        <button type="submit">Register</button><br/><br/>
        <button onClick={handleSendToRegister}>Already signed up</button><br/>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default SignUpPage;

