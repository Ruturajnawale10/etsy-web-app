import React from "react";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

function Shophome(props) {
    let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
    return (
        <div>
        {redirectVar}
        <h1>{props.name}</h1>
        </div>
    )
}

export default Shophome;