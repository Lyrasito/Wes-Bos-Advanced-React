import { Query } from "react-apollo";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import styled from "styled-components";

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightGrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CART_ITEM_QUERY = gql`
  query CART_ITEM_QUERY($id: ID!) {
    cartItem(id: $id) {
      id
      quantity
      item {
        id
        title
      }
    }
  }
`;

const CartItem = (props) => {
  const { item } = props.cartItem;
  return (
    <CartItemStyles>
      <img src={item.image} width="100" alt={item.title} />
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>
          {formatMoney(item.price * props.cartItem.quantity)} -{" "}
          <em>
            {props.cartItem.quantity} &times; {formatMoney(item.price)} each
          </em>
        </p>
      </div>
    </CartItemStyles>
  );
};
export default CartItem;
