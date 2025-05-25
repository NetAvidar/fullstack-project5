import { useNavigate, Link, Navigate } from "react-router-dom";
import React, {useEffect, useState} from "react";

function HomePage() {

  const logedInUserName = localStorage.getItem('currentUser') || '';
  console.log(`${logedInUserName}`);

  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(()=>{

    if (!logedInUserName) {
      console.log("No user found in localStorage");
      return;
    }
    fetch(`http://localhost:3005/users?username=${logedInUserName}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        setUser(data[0]);
        console.log("User found on server:", data[0]);
      } else {
        console.log("User not found");
        setUser(null);
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });

  }, []);


  let userFullName='';
  if(user){
    userFullName = user.name;}
  else{
    userFullName = '';
  }

  
  function handleLogout(e){
     e.preventDefault();
     //logedInUser = null;
     localStorage.setItem('currentUser', null);
     navigate("/");

  }

  return (

    <div style={{ display: 'flex' }}>
      <nav style={{ width: '200px', height: '100 vh', backgroundColor: '#eee', padding: '10px' }}>
          <h3>Sidebar</h3>
          <ul>
            <li><Link>Info</Link></li>
            <li><Link to= "/todos">Todos</Link></li>
            <li><Link to= "/posts">Posts</Link></li>
            <li><Link to= "/albums">Albums</Link></li>
            <li><a href="#" onClick={handleLogout}>Logout </a></li>
          </ul>
      </nav>
      <div>
        <h1>Hello {user? user.name: ''} </h1>
      </div>
    </div>
  );
}
export default HomePage;


