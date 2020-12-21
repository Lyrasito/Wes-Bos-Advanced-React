import { mount } from "enzyme";
import wait from "waait";
import CartComponent, { LOCAL_STATE_QUERY } from "../components/Cart";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

const me = fakeUser();

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...me, cart: [fakeCartItem()] } } },
  },
  {
    request: { query: LOCAL_STATE_QUERY },
    result: { data: { cartOpen: true } },
  },
];

describe("<CartComponent />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CartComponent />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find("header"))).toMatchSnapshot();
    expect(wrapper.find("CartItem")).toHaveLength(1);
  });
});
