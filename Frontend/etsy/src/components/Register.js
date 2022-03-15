import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";

//Define a Login Component
class Register extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      email: "",
      password: "",
      authFlag: false,
      authMsg: null,
    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  //submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/register", data).then((response) => {
      console.log("Data isss: ", response.data);
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        this.setState({
          authFlag: true,
        });
      } else {
        this.setState({
          authFlag: false,
        });
      }

      if (response.data === "Login Failed") {
        console.log("seeee:", response.data);
        this.setState({
          authMsg: (
            <div class="invalid-feedback">
              Invalid credentials. Please relogin.
            </div>
          ),
        });
      } else {
        console.log("Whatt", response.data);
      }
    });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (cookie.load("cookie")) {
      redirectVar = <Redirect to="/home" />;
    }

    return (
      <div>
        {redirectVar}
        <form onSubmit={this.submitLogin}>
          <div class="container">
            <div class="login-form">
              <div class="main-div">
                <div class="panel">
                  <h2>Registration</h2>
                  <p>Please enter these details</p>
                </div>

                <div class="form-group">
                  <input
                    onChange={this.usernameChangeHandler}
                    type="text"
                    class="form-control"
                    name="username"
                    placeholder="Username"
                    required
                    autoFocus
                  />
                </div>
                <div class="form-group">
                  <input
                    onChange={this.emailChangeHandler}
                    type="email"
                    class="form-control"
                    name="email"
                    placeholder="Email ID"
                    required
                  />
                </div>
                <div class="form-group">
                  <input
                    onChange={this.passwordChangeHandler}
                    type="password"
                    class="form-control"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary">
                  Register
                </button>
                {this.state.authMsg}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
//export Login Component
export default Register;
