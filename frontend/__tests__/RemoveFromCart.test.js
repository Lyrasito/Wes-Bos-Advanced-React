import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import RemoveFromCartComponent, {
  REMOVE_FROM_CART_MUTATION,
} from "../components/RemoveFromCart";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

global.alert = console.log;

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: { ...fakeUser(), cart: [fakeCartItem({ id: "abc123" })] },
      },
    },
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: "abc123" },
    },
    result: {
      data: {
        removeFromCart: {
          __typename: "CartItem",
          id: "abc123",
        },
      },
    },
  },
];

describe("<RemoveFromCartComponent />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCartComponent id="abc123" />
      </MockedProvider>
    );
    expect(toJSON(wrapper.find("button"))).toMatchSnapshot();
  });
  it("removes the item from the cart", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <RemoveFromCartComponent id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res.data.me.cart).toHaveLength(1);
    expect(res.data.me.cart[0].quantity).toBe(3);
    wrapper.find("button").simulate("click");
    await wait();
    const res2 = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res2.data.me.cart[0].quantity).toBe(2);
    wrapper.find("button").simulate("click");
    await wait();
    wrapper.find("button").simulate("click");
    await wait();
    const res3 = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(res3.data.me.cart).toHaveLength(0);
  });
});
