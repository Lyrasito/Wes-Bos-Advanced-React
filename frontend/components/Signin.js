import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
      password
      permissions
    }
  }
`;

class Signin extends React.Component {
  state = {
    email: "",
    password: "",
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div>
        <Mutation
          mutation={SIGNIN_MUTATION}
          variables={this.state}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {(signin, { loading, error }) => {
            return (
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await signin();
                  this.setState({ email: "", password: "" });
                }}
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Sign in to your account</h2>
                  <Error error={error}></Error>
                  <label htmlFor="email">
                    Email{" "}
                    <input
                      type="email"
                      name="email"
                      value={this.state.email}
                      placeholder="email"
                      onChange={this.handleChange}
                    />
                  </label>
                  <label htmlFor="password">
                    Password{" "}
                    <input
                      type="password"
                      name="password"
                      value={this.state.password}
                      placeholder="password"
                      onChange={this.handleChange}
                    />
                  </label>
                  <button type="submit">Sign In</button>
                </fieldset>
              </Form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default Signin;
