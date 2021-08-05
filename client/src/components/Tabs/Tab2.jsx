import { React, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

export default function Tab2() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user/data", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.users);
        setUserData(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(user) {
    const userProfile = {
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      address: user.address,
    };
    console.log(userProfile);
    axios
      .post("http://localhost:8080/user/data/delete", userProfile, {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("Internal Server Error");
      });
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Username</th>
          <th>Mobile</th>
          <th>Email</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {userData.map((user, index) => {
          return (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.mobile}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>
                <button
                  onClick={() => {
                    handleDelete(user);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
