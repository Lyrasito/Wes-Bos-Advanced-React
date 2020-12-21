import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import NProgress from "nprogress";
import Router from "next/router";
import OrderComponent, { SINGLE_ORDER_QUERY } from "../components/Order";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem, fakeOrder } from "../lib/testUtils";

const mocks = [
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      me: {
        ...fakeUser(),
        orders: [fakeOrder({ id: "singleorderid" })],
      },
    },
  },
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: { id: "singleorderid" },
    },
    result: {
      data: {
        order: {
          ...fakeOrder(),
          id: "singleorderid",
        },
      },
    },
  },
];

describe("<OrderComponent />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <OrderComponent id="singleorderid" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const order = wrapper.find("div[data-test='order']");
    expect(toJSON(order)).toMatchSnapshot();
  });
});
