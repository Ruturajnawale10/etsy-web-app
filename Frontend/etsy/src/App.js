import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import Userprofile from './components/Userprofile';
import Favourites from './components/Favourites';
import Sellonetsy from './components/Sellonetsy';
import Cart from './components/Cart';

function App() {
  return (
    //Use Browser Router to route to different pages
    <Router>
    <div>
      <Navbar/>
        <Switch>
              <Route exact path="/" component={Dashboard}/>
              <Route path="/login" component={Login}/>
              <Route path="/logout" component={Logout}/>
              <Route path="/register" component={Register}/>
              <Route path="/profile" component={Userprofile}/>
              <Route path="/favourites" component={Favourites}/>
              <Route path="/sellonetsy" component={Sellonetsy}/>
              <Route path="/cart" component={Cart}/>
              <Redirect from='*' to='/' />    {/*redirects any other url other then above to / path i.e. login*/}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
