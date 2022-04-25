import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import { Redirect } from "react-router";
import jwtDecode from "jwt-decode";

//Define a Login Component
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      authMsg: null,
      token: "",
      redirectVar1: null,
    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
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
    //prevent page from refresh
    e.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    //make a post request with the user data
    axios
      .post(process.env.REACT_APP_LOCALHOST + "/user/login", data)
      .then((response) => {
        if (response.data === "Invalid credentials") {
          this.setState({
            authMsg: (
              <p style={{ color: "red" }}>
                Invalid credentials. Please check again, or register for new
                account.
              </p>
            ),
          });
        } else {
          localStorage.setItem("currency", response.data.currency);
          localStorage.setItem("country", response.data.country);
          localStorage.setItem("pageSize", 5);
          localStorage.setItem("pageNum", 1);
          this.setState({
            token: response.data.jwt,
          });
        }
      });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (this.state.token.length > 0) {
      localStorage.setItem("token", this.state.token);

      var decoded = jwtDecode(this.state.token.split(" ")[1]);
      localStorage.setItem("user_id", decoded._id);
      localStorage.setItem("username", decoded.username);

      redirectVar = <Redirect to="/home" />;
    }

    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2>Login</h2>
                <p>Please enter your username and password</p>
              </div>

              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  class="form-control"
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.passwordChangeHandler}
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <button onClick={this.submitLogin} class="btn btn-primary">
                Login
              </button>
              {this.state.authMsg}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//export Login Component
export default Login;
