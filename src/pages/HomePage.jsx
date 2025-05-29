import { useNavigate, Link } from "react-router-dom";
import React, {useEffect, useState} from "react";

function HomePage() {

  const logedInUserName = localStorage.getItem('currentUser') || '';
  console.log('${logedInUserName}');

  const [user, setUser] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  const navigate = useNavigate();


  useEffect(()=>{

    if (!logedInUserName) {
      console.log("No user found in localStorage");
      return;
    }
    fetch('http://localhost:3005/users?username=${logedInUserName}')
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
  if (user) {
    userFullName = user.name;}
  else{
    userFullName = '';
  }
 
  
  function handleLogout(e){
     e.preventDefault();
     localStorage.setItem('currentUser', null);
     navigate("/");

  }

  function handleInfo(e){
    
    e.preventDefault();
    setShowInfo((s)=>!s);
  };

  

  return (
    <div style={{ display: 'flex' }}>
      <nav style={{ width: '200px', height: '100vh', backgroundColor: '#eee', padding: '10px' }}>
        <h3>Sidebar</h3>
        <ul>
          <li><a href="#" onClick={handleInfo}>Info</a></li>
          <li><Link to="/todos">Todos</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/albums">Albums</Link></li>
          <li><a href="#" onClick={handleLogout}>Logout</a></li>
        </ul>
      </nav>
      <div style={{ marginLeft: '20px', padding: '10px', flex: 1 }}>
        <h1>Hello {userFullName}</h1>

        {showInfo ? (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', maxWidth: '400px', backgroundColor: '#fafafa' }}>
            <h2>User Info</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Website:</strong> {user.website}</p>

            <h3>Address</h3>
            <p>{user.address.street} {user.address.suite}</p>
            <p>{user.address.city} {user.address.zipcode}</p>

            <h3>Company</h3>
            <p><strong>Name:</strong> {user.company.name}</p>
            <p>{user.company.catchPhrase}</p>
            <p>{user.company.bs}</p>
          </div>
        ) : (
          <p style={{ marginTop: '20px' }}>Click on <em>Info</em> to disply more.</p>
        )}
      </div>
    </div>
  );
}
export default HomePage;