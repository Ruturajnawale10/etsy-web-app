import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
// import Home from './Home/Home';
// import Delete from './Delete/Delete';
// import Create from './Create/Create';
// import Navbar from './LandingPage/Navbar';
//Create a Main Component
function Main() {
    return(
        <div>
            {/*Render Different Component based on Route*/}
            <Route path="/" component={Register}/>
            <Route path="/login" component={Login}/>
            {/*<Route path="/home" component={Home}/>
            <Route path="/delete" component={Delete}/>
            <Route path="/create" component={Create}/>*/}
        </div>
    )
}
//Export The Main Component
export default Main;