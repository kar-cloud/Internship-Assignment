import { React, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Home from "./components/Home";
import axios from "axios";

function App() {
  const [auth, setAuth] = useState(false);

  const baseURL = "https://userintern.herokuapp.com/";

  useEffect(() => {
    axios
      .get(baseURL + "/user/auth/check/login", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.auth);
        if (response.data.auth) {
          setAuth(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function loggedIn() {
    setAuth(true);
  }

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            {auth ? <Redirect to="/home" /> : <Login loggedIn={loggedIn} />}
          </Route>
          <Route path="/home">
            {!auth ? <Redirect to="/login" /> : <Home />}
          </Route>
          <Route path="/">
            {auth ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
