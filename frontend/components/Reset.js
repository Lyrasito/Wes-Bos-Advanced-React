import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import propTypes from "prop-types";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      name
      id
      email
    }
  }
`;

class Reset extends React.Component {
  static propTypes = {
    resetToken: propTypes.string.isRequired,
  };
  state = {
    password: "",
    confirmPassword: "",
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div>
        <Mutation
          mutation={RESET_MUTATION}
          variables={{
            resetToken: this.props.resetToken,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
          }}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {(reset, { loading, error, called }) => {
            return (
              <Form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await reset();
                  this.setState({ password: "", confirmPassword: "" });
                }}
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Enter your new password.</h2>
                  <Error error={error}></Error>
                  {!error && !loading && called && (
                    <p>Password changed successfully!</p>
                  )}
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
                  <label htmlFor="confirmPassword">
                    Confirm Password{" "}
                    <input
                      type="password"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      placeholder="confirm password"
                      onChange={this.handleChange}
                    />
                  </label>

                  <button type="submit">Send </button>
                </fieldset>
              </Form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default Reset;
