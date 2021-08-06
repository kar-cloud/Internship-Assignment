import { React, useState } from "react";
import axios from "axios";

export default function Tab1() {
  const [username, setUsername] = useState();
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();

  const baseURL = "https://userintern.com:" + process.env.PORT;

  const validUsername = /^[a-zA-Z0-9_@./#&+-]*$/;
  const validMobile = /^\d{10}$/;
  const validEmail =
    /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+(.[a-zA-z])?$/;

  function handleSubmit(event) {
    event.preventDefault();
    if (!username.match(validUsername)) {
      alert(
        "Username should contain only alphanumeric characters and no spaces"
      );
    } else if (!mobile.match(validMobile)) {
      alert("Mobile Number should be of 10 digits");
    } else if (!email.match(validEmail)) {
      alert("Please enter a valid Email");
    } else {
      const userFormData = {
        username: username,
        mobile: mobile,
        email: email,
        address: address,
      };

      // sending user data
      axios
        .post(baseURL + "/users/add", userFormData, {
          withCredentials: true,
          credentials: "include",
        })
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          }
          if (response.data.success) {
            alert(response.data.success);
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("Internal Server Error");
        });
    }
  }

  return (
    <div className="loginContainer">
      <h1 className="tableHeading">User Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="registrationForm">
          <label className="registrationLabel" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            className="loginInput"
            name="username"
            autoComplete="off"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          />
          <label className="registrationLabel" htmlFor="number">
            Mobile Number
          </label>
          <div>
            <input
              type="number"
              className="loginInput"
              name="number"
              onChange={(event) => {
                setMobile(event.target.value);
              }}
              required
            />
          </div>
          <label className="registrationLabel" htmlFor="email">
            Email
          </label>
          <div>
            <input
              type="email"
              name="email"
              className="loginInput"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
            />
          </div>
          <label className="registrationLabel" htmlFor="address">
            Address
          </label>
          <div>
            <input
              type="text"
              name="address"
              className="loginInput"
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              required
            />
          </div>

          <button className="registrationContinueButton" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
