import './App.css';
import React, {Component} from 'react';
import Navbar from './components/Navbar';
import NavbarMobile from './components/NavbarMobile';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import Userprofile from './components/Userprofile';
import Favourites from './components/Favourites';
import Sellonetsy from './components/Sellonetsy';
import Cart from './components/Cart';
import Itemsoverview from './components/Itemsoverview';
import Purchases from './components/Purchases';
import Searchitems from './components/Searchitems';
import ShopDetails from './components/ShopDetails';

function App() {
  let NavBar = (<Navbar/>);
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
   NavBar = (<NavbarMobile/>);
   }
   
  return (
    //Use Browser Router to route to different pages
    <Router>
    <div>
      {NavBar}
        <Switch>
              <Route exact path="/items" component={Dashboard}/>
              <Route path="/login" component={Login}/>
              <Route path="/logout" component={Logout}/>
              <Route path="/register" component={Register}/>
              <Route path="/your/profile" component={Userprofile}/>
              <Route exact path="/items/favourites" component={Favourites}/>
              <Route path="/your/shop" component={Sellonetsy}/>
              <Route path="/cart" component={Cart}/>
              <Route path="/items/shopdetails" component={ShopDetails}/>
              <Route path="/items/search" component={Searchitems}/>
              <Route path="/items" component={Itemsoverview}/>
              <Route path="/purchases" component={Purchases}/>
              <Redirect from='*' to='/items' />    {/*redirects any other url other then above to / path i.e. login*/}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
