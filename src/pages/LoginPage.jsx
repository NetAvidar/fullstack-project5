import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import "../css/login.css"

function LoginPage() {

  const navigate = useNavigate();

   const {
    username,
    setUsername,
    password,
    setPassword,
    isLoggedIn,
    error,
    login,
  } = useLogin();



  useEffect(()=>{
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser !== null && currentUser !== "null" && currentUser !== ""){
      alert(`username = ${localStorage.getItem('currentUser')}`)
      navigate("/home");
    }
  },[]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

    const handleSendToRegister = (e) => {
      navigate("/register");
  };


  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
        /><br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        /><br/>
        <button type="submit" className="login-button">Login</button>

        <button onClick={handleSendToRegister} className="signup-button" >Not sign up yet</button>
      </form>
      {error && <p className="error-message" >{error}</p>}
    </div>
  );
}


export default LoginPage;
