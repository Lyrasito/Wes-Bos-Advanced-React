import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Head from "next/head";
import Error from "./ErrorMessage";

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
    console.log(this.props.id);
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
