import { useNavigate, Link, Navigate } from "react-router-dom";
import React, {useEffect, useState} from "react";

function HomePage() {

  const logedInUserName = localStorage.getItem('currentUser') || '';
  console.log(`${logedInUserName}`);

  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
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

  }, [user]);


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
    fetch(`http://localhost:3005/users?username=${logedInUserName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          throw new Error(`Can't find info about ${logedInUserName}`);
        }
        setUserInfo(data[0]);
      })
      .catch((error) => {
        console.error(error);
        setUserInfo(null);
      });
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
        <h1>Hello {user ? user.name : ''}</h1>

        {userInfo ? (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', maxWidth: '400px', backgroundColor: '#fafafa' }}>
            <h2>User Info</h2>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Phone:</strong> {userInfo.phone}</p>
            <p><strong>Website:</strong> {userInfo.website}</p>

            <h3>Address</h3>
            <p>{userInfo.address.street} {userInfo.address.suite}</p>
            <p>{userInfo.address.city} {userInfo.address.zipcode}</p>

            <h3>Company</h3>
            <p><strong>Name:</strong> {userInfo.company.name}</p>
            <p>{userInfo.company.catchPhrase}</p>
            <p>{userInfo.company.bs}</p>
          </div>
        ) : (
          <p style={{ marginTop: '20px' }}>Click on <em>Info</em> to disply more.</p>
        )}
      </div>
    </div>
  );
}
export default HomePage;


