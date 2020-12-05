import React from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends React.Component {
  state = {};

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log(this.state, this.props.id);

    console.log("updating items");
    const res = await updateItemMutation({
      variables: { ...this.state, id: this.props.id },
    });

    console.log("Updated!");
  };

  render() {
    return (
      <div>
        <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
          {({ data, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (!data.item) return <p>No item found for id {this.props.id}</p>;
            return (
              <Mutation mutation={UPDATE_ITEM_MUTATION}>
                {(updateItem, { loading, error }) => (
                  <Form
                    onSubmit={(e) => {
                      console.log(e);
                      this.updateItem(e, updateItem);
                    }}
                  >
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading}>
                      <label htmlFor="title">
                        title
                        <input
                          type="text"
                          id="title"
                          name="title"
                          placeholder={data.item.title}
                          required
                          defaultValue={data.item.title}
                          onChange={this.handleChange}
                        />
                      </label>
                      <label htmlFor="price">
                        price
                        <input
                          type="number"
                          id="price"
                          name="price"
                          placeholder="Price"
                          required
                          defaultValue={data.item.price}
                          onChange={this.handleChange}
                        />
                      </label>
                      <label htmlFor="description">
                        description
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Write a description"
                          required
                          defaultValue={data.item.description}
                          onChange={this.handleChange}
                        />
                      </label>
                      <button type="submit">Save Changes</button>
                    </fieldset>
                  </Form>
                )}
              </Mutation>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
