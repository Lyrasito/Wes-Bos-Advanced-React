import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import PropTypes from "prop-types";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const RemoveFromCart = (props) => (
  <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ id: props.id }}>
    {(removeFromCart, { data, loading, error }) => {
      console.log(props.id);
      console.log(data);
      console.log(error);
      return <button onClick={removeFromCart}>Remove from cart</button>;
    }}
  </Mutation>
);

export default RemoveFromCart;
