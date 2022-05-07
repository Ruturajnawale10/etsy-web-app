import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Newshop from "./Newshop";
import Shophome from "./Shophome";

function Sellonetsy() {
  let redirectVar = null;
  let [newShop, setNewShop] = useState(null);
  let [shophome, setShophome] = useState(null);

  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    const qlQuery = async (query, variables = {}) => {
      const resp = await fetch("http://localhost:4001", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      return (await resp.json()).data;
    };

    (async () => {
      let response = await qlQuery(
        "query _($userInput: UserInput) {checkIfUserCreatedShop(user: $userInput)}",
        {
          userInput: {
            username: localStorage.getItem("username"),
          },
        }
      );

      if (response.checkIfUserCreatedShop === "shopname not registered") {
        setShophome(<Newshop />);
      } else {
        let shopName = response.checkIfUserCreatedShop;
        setNewShop(<Shophome name={shopName} />);
      }
    })();
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
