import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends React.Component {
  state = {
    email: "",
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { loading, error, called }) => {
          return (
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await reset();
                this.setState({ email: "" });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <Error error={error}></Error>
                {!error && !loading && called && (
                  <p>
                    Request sent successfully! Please check your email for a
                    reset link.
                  </p>
                )}
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

                <button type="submit">Send Request</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
