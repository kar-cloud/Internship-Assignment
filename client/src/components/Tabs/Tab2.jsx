import { React, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Tab2() {
  const [userData, setUserData] = useState([]);

  const baseURL = "https://userintern.herokuapp.com/:" + process.env.PORT;

  useEffect(() => {
    axios
      .get(baseURL + "/user/data", {
        withCredentials: true,
      })
      .then((response) => {
        setUserData(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleDelete(user, recievedIndex) {
    const userProfile = {
      username: user.username,
      mobile: user.mobile,
      email: user.email,
      address: user.address,
    };

    setUserData(
      userData.filter((user, index) => {
        return index !== recievedIndex;
      })
    );

    axios
      .post(baseURL + "/user/data/delete", userProfile, {
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
    <>
      <h1 className="tableHeading">Users</h1>
      <Table className="tableStructure" bordered hover>
        <thead className="tableStructureHeading">
          <tr>
            <th>Username</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => {
            return (
              <tr key={index} className="tableStructureRow">
                <td>{user.username}</td>
                <td>{user.mobile}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <Button
                    // id="tableStructureButton"
                    onClick={() => {
                      handleDelete(user, index);
                    }}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
