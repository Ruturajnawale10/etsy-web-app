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

    const qlQuery = async (query, variables = {}) => {
      const resp = await fetch("http://localhost:4001", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      return (await resp.json()).data;
    };

    (async () => {
      // Mutation addUser
      let response = await qlQuery(
        "mutation _($userInput: UserInput) {addUser(user: $userInput) }",
        {
          userInput: {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
          },
        }
      );

      if (response.addUser === "SUCCESS") {
        this.setState({
          authMsg: <Redirect to="/login" />,
        });
      } else {
        this.setState({
          authMsg: <p style={{ color: "red" }}>Username already exists!</p>,
        });
      }
    })();
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
        <form onSubmit={this.submitRegister}>
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

export default Register;
