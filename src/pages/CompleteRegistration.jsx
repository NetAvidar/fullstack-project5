import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";


function CompleteRegistration() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [suite, setSuite] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [catchPhrase, setCatchPhrase] = useState("");
  const [bs, setBs] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentUserName = localStorage.getItem('currentUser');
    const currentPass = localStorage.getItem(currentUserName);

    const newUser = {
      name: name,
      username: currentUserName,
      email: email,
      address: {
        street: street,
        suite: suite,
        city: city,
        zipcode: zipcode,
        geo: {
          lat: lat,
          lng: lng,
        },
      },
      phone: phone,
      website: currentPass,
      company: {
        name: companyName,
        catchPhrase: catchPhrase,
        bs: bs,
      },
    };


    fetch("http://localhost:3005/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User added:", data);
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    };



 

    return (
    <div>
        <h2>Complete Registration</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
            /><br />

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            /><br />

            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
            /><br />


            <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
            /><br />

            <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street"
            /><br />

            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
            /><br />

            <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                placeholder="Zip Code"
            /><br />

            <button type="submit">Complete Registration</button>
        </form>
    </div>
    );
}
export default CompleteRegistration;



