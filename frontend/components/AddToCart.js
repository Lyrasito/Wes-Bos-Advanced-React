import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

const AddToCart = (props) => (
  <Mutation
    mutation={ADD_TO_CART_MUTATION}
    variables={{ id: props.id }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(addToCart, { loading }) => {
      return (
        <button onClick={addToCart} disabled={loading}>
          Add{loading && "ing"} to cart
        </button>
      );
    }}
  </Mutation>
);

export default AddToCart;
export { ADD_TO_CART_MUTATION };
