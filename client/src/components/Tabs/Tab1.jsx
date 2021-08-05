import { React, useState } from "react";
import axios from "axios";

export default function Tab1() {
  const [username, setUsername] = useState();
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();

  function handleSubmit(event) {
    event.preventDefault();
    const userFormData = {
      username: username,
      mobile: mobile,
      email: email,
      address: address,
    };

    // sending user data
    axios
      .post("http://localhost:8080/users/add", userFormData, {
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

  return (
    <div className="loginContainer">
      <div className="container">
        <div className="row" id="loginUpperRow">
          <h1 className="loginHeading">User Form</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="loginInputUsername"
            name="username"
            autoComplete="off"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          />
        </div>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="number">
            Mobile Number
          </label>
          <div>
            <input
              type="number"
              className="form-control"
              name="number"
              id="loginInputNumber"
              onChange={(event) => {
                setMobile(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="email">
            Email
          </label>
          <div>
            <input
              type="email"
              className="form-control"
              name="email"
              id="loginInputEmail"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="address">
            Address
          </label>
          <div>
            <input
              type="text"
              className="form-control"
              name="address"
              id="loginInputAddress"
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              required
            />
          </div>
        </div>
        <button className="loginButtons" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
