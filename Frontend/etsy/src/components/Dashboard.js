import React from "react";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

function Dashboard() {
    let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }

    return (
        <div>
        {redirectVar}
        <h1>Welcome to Dashboard</h1>
        </div>
    )
}

export default Dashboard;