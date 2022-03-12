import React from "react";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Newshop from "./Newshop";

function Sellonetsy() {
    let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        
    return (
        <div className="row">
        {redirectVar}
        <Newshop/>

        </div>
    )
}

export default Sellonetsy;