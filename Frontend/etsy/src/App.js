import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';

function App() {
  return (
    //Use Browser Router to route to different pages
    <Router>
    <div>
      <Navbar/>
        <Switch>
              <Route exact path="/" component={Dashboard}/>
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Redirect from='*' to='/' />    {/*redirects any other url other then above to / path i.e. login*/}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
