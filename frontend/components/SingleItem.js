import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Head from "next/head";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import AddToCart from "./AddToCart";
import SickButton from "./styles/SickButton";

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${(props) => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
  button {
    background: red;
    color: white;
    font-weight: 500;
    border: 0;
    border-radius: 0;
    text-transform: uppercase;
    font-size: 2rem;
    padding: 0.8rem 1.5rem;
    transform: skew(-2deg);
    display: inline-block;
    transition: all 0.5s;
    &[disabled] {
      opacity: 0.5;
    }
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      largeImage
    }
  }
`;

class SingleItem extends React.Component {
  render() {
    return (
      <div>
        <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
          {({ loading, error, called, data }) => {
            const item = data.item;
            if (error) {
              return <Error error={error} />;
            }
            if (loading) {
              return <p>Loading...</p>;
            }
            if (!item) {
              return <p>No item found for id {this.props.id}</p>;
            }
            return (
              <SingleItemStyles>
                <Head>
                  <title>Sick Fits | {item.title}</title>
                </Head>
                <img src={item.largeImage} alt={item.title} />
                <div className="details">
                  <h2>Viewing {item.title}</h2>
                  <p>{item.description}</p>
                  <p>{formatMoney(item.price)}</p>
                  <AddToCart id={item.id} />
                </div>
              </SingleItemStyles>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default SingleItem;
