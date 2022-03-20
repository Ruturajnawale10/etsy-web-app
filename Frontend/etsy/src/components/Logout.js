import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";

function Logout() {
  const [authMsg, setAuthMsg] = useState(null);

  axios.defaults.withCredentials = true;
  //make a post request with the user data
  axios.post(process.env.REACT_APP_LOCALHOST + "/logout").then((response) => {
    console.log("Data isss: ", response.data);
    console.log("Status Code : ", response.status);
    if (response.status === 200) {
      setAuthMsg(true);
    } else {
      setAuthMsg(false);
    }
  });

  return (
    <div>
      {authMsg}
      <Redirect to="/login" />
    </div>
  );
}

export default Logout;
