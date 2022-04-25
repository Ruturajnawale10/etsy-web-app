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
          <h2>Login</h2>
          <form>
            <div class="mb-3">
              <label for="userName" class="form-label">
                Username
              </label>
              <input
                type="text"
                class="form-control"
                id="userName"
                onChange={this.usernameChangeHandler}
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">
                Password
              </label>
              <input
                type="password"
                class="form-control"
                id="password"
                onChange={this.passwordChangeHandler}
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              style={{ backgroundColor: "darkorange" }}
              onClick={this.submitLogin}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}
//export Login Component
export default Login;
