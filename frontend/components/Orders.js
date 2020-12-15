import { Query } from "react-apollo";
import gql from "graphql-tag";
import { formatDistance } from "date-fns";
import Link from "next/link";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import OrderItemStyles from "./styles/OrderItemStyles";

const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    orders {
      id
      total
      createdAt
      items {
        id
        title
        description
        quantity
        price
        image
      }
    }
  }
`;

const OrdersUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const Orders = (props) => {
  return (
    <Query query={ALL_ORDERS_QUERY}>
      {({ data, loading, error }) => {
        console.log(data);

        return (
          <div>
            <h2>You have {data.orders.length} orders.</h2>
            <OrdersUl>
              {data.orders.map((order) => {
                console.log(order.items);
                const itemsCount = order.items.reduce(
                  (a, b) => a + b.quantity,
                  0
                );
                console.log(itemsCount);
                return (
                  <OrderItemStyles key={order.id}>
                    <Link href={{ pathname: "/order", query: order.id }}>
                      <a>
                        <div className="order-meta">
                          <p>
                            {itemsCount} Item{itemsCount === 1 ? "" : "s"}
                          </p>
                          <p>
                            {order.items.length} Product
                            {order.items.length === 1 ? "" : "s"}
                          </p>
                          <p>{formatDistance(order.createdAt, new Date())}</p>
                          <p>{formatMoney(order.total)} </p>
                        </div>
                        <div className="images">
                          {order.items.map((item) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.title}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                );
              })}
            </OrdersUl>
          </div>
        );
      }}
    </Query>
  );
};

export default Orders;
