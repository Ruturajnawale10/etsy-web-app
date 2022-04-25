import React, { Component } from "react";
import "../App.css";
import axios from "axios";
import { Redirect } from "react-router";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      authMsg: null,
    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
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
  submitRegister = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    //set the with credentials to true
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    //make a post request with the user data
    axios
      .post(process.env.REACT_APP_LOCALHOST + "/user/register", data)
      .then((response) => {
        if (response.data === "ALREADY EXISTS") {
          this.setState({
            authMsg: <p style={{ color: "red" }}>Username already exists!</p>,
          });
        } else {
          this.setState({
            authMsg: <Redirect to="/login" />,
          });
        }
      });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (localStorage.getItem("token")) {
      redirectVar = <Redirect to="/home" />;
    }

    return (
      <div>
        {redirectVar}
        <div class="container">
          <h2>Register</h2>
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
              class="btn btn-primary"
              style={{ backgroundColor: "darkorange" }}
              onClick={this.submitRegister}
            >
              Register
            </button>
            {this.state.authMsg}
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
