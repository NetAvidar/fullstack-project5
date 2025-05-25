import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        /><br/>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        /><br/>
        <button type="submit">Login</button> <br/><br/>

        <button onClick={handleSendToRegister}>Not sign up yet</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}


export default LoginPage;
