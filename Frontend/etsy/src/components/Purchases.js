import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Itemcard from "./Itemcard";

function Purchases() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    //todo: fetch purchase details API here
  }, []);

  return (
    <div>
      {redirectVar}
      <h1>Past Purchases</h1>
      {items}
    </div>
  );
}

export default Purchases;
