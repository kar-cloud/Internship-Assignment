import axios from "axios";
import { React, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleLogin(event) {
    event.preventDefault();
    const userLoginData = {
      email: email,
      password: password,
    };
    // sending login data
    axios
      .post("http://localhost:8080/user/auth/login", userLoginData, {
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
        console.log(err);
        console.log("Internal Server Error");
      });
  }

  return (
    <div className="loginContainer">
      <div className="container">
        <div className="row" id="loginUpperRow">
          <h1 className="loginHeading">Login</h1>
        </div>
      </div>
      <form onSubmit={handleLogin}>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="loginInputUsername"
            name="email"
            autoComplete="off"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
          />
        </div>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="password">
            Password
          </label>
          <div>
            <input
              type="password"
              className="form-control"
              name="password"
              id="loginInputPassword"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <button className="loginButtons" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
