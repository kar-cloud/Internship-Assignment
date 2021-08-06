import axios from "axios";
import { React, useState } from "react";

function Login(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const baseURL = "https://userintern.com:" + process.env.PORT;

  async function handleLogin(event) {
    event.preventDefault();
    const userLoginData = {
      email: email,
      password: password,
    };
    // sending login data
    axios
      .post(baseURL + "/user/auth/login", userLoginData, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
        if (response.data.auth) {
          props.loggedIn();
        }
      })
      .catch((err) => {
        alert("Internal Server Error");
      });
  }

  return (
    <div>
      <h1 className="loginHeading">Login</h1>
      <form onSubmit={handleLogin}>
        <div className="registrationForm">
          <label className="registrationLabel" htmlFor="emailAddress">
            Email
          </label>
          <input
            id="emailAddress"
            className="loginInput"
            placeholder="Email"
            autoComplete="off"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
          />
          <label className="registrationLabel" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="loginInput"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
          <button className="registrationContinueButton" type="submit">
            <p>LOGIN</p>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
