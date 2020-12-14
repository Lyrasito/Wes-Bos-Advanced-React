import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import PropTypes from "prop-types";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends React.Component {
  update = (cache, payload) => {
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });

    const cartItemId = payload.data.removeFromCart.id;
    const cartItem = data.me.cart.find((item) => item.id === cartItemId);
    const cartItemIndex = data.me.cart.findIndex(
      (item) => item.id === cartItemId
    );
    if (cartItem.quantity > 1) {
      data.me.cart[cartItemIndex].quantity = cartItem.quantity - 1;
    } else if (cartItem.quantity === 1) {
      data.me.cart = data.me.cart.filter((item) => item.id !== cartItemId);
    }
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: { __typename: "CartItem", id: this.props.id },
        }}
      >
        {(removeFromCart, { data, loading, error }) => {
          return (
            <BigButton
              disabled={loading}
              onClick={() => {
                removeFromCart().catch((err) => alert(err.message));
              }}
              title="Delete Item"
            >
              &times;
            </BigButton>
          );
        }}
      </Mutation>
    );
  }
}
export default RemoveFromCart;
