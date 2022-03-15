import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Newshop from "./Newshop";
import Shophome from "./Shophome";

function Sellonetsy() {
  let redirectVar = null;
  let [newShop, setNewShop] = useState(null);
  let [shophome, setShophome] = useState(null);

  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    console.log("useefffect");
    axios.get("http://localhost:3001/shopexists").then((response) => {
      if (response.data === "shopname not registered") {
        setShophome(<Newshop />);
      } else {
        let shopName = response.data;
        console.log(response.data);
        setNewShop(<Shophome name={shopName} />);
      }
    });
  }, []);

  return (
    <div>
      {redirectVar}
      {newShop}
      {shophome}
    </div>
  );
}

export default Sellonetsy;
