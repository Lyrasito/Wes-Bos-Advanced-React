import React from "react";
import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      name
      email
      id
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $userId: ID!
    $permissions: [Permission]!
  ) {
    updatePermissions(userId: $userId, permissions: $permissions) {
      name
      email
      id
      permissions
    }
  }
`;

const permissionsArray = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE",
];
const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (error) return <Error error={error} />;
      return (
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {permissionsArray.map((permission) => (
                  <th key={permission}>{permission}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
        </div>
      );
    }}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };
  state = {
    permissions: this.props.user.permissions,
  };
  onChange = (e) => {
    let newPermissions = [...this.state.permissions];
    if (e.target.checked) {
      newPermissions.push(e.target.value);
    } else {
      newPermissions = newPermissions.filter(
        (permission) => permission !== e.target.value
      );
    }

    this.setState({ permissions: newPermissions });
  };
  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{ userId: user.id, permissions: this.state.permissions }}
      >
        {(updatePermissions, { called, data, loading, error }) => {
          //console.log("user", user.id, user.name);

          return (
            <>
              {error && (
                <tr>
                  <td colSpan="8">
                    <Error error={error} />
                  </td>
                </tr>
              )}
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {permissionsArray.map((permission) => (
                  <td key={permission}>
                    <label htmlFor={`${user.id}-permission-${permission}`}>
                      <input
                        type="checkbox"
                        id={`${user.id}-permission-${permission}`}
                        checked={this.state.permissions.includes(permission)}
                        value={permission}
                        onChange={this.onChange}
                      />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton onClick={updatePermissions} disabled={loading}>
                    Updat{loading ? "ing" : "e"}
                  </SickButton>
                </td>
              </tr>
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default Permissions;
