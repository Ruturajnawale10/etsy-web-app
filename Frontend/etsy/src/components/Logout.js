import React, { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";

function Logout() {
  const [authMsg, setAuthMsg] = useState(null);

  axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  axios
    .post(process.env.REACT_APP_LOCALHOST + "/user/logout")
    .then((response) => {
      if (response.status === 200) {
        console.log("Loggout out dude!");

        setAuthMsg(true);
      } else {
        setAuthMsg(false);
      }
    });

  return (
    <div>
      {authMsg}
      <Redirect to="/user/login" />
    </div>
  );
}

export default Logout;
