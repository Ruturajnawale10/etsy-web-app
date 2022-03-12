import React from "react";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

function Cart() {
    let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        
    return (
        <div>
        {redirectVar}
        <h1>Cart Page</h1>
        </div>
    )
}

export default Cart;