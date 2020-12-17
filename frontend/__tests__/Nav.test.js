import { mount } from "enzyme";
import wait from "waait";
import NavComponent from "../components/Nav";
import toJSON from "enzyme-to-json";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];
const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];
const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        },
      },
    },
  },
];

describe("<NavComponent/>", () => {
  it("renders a minimal nav when signed out", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <NavComponent />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    //when using styled components, it will make a copy of the element. So to narrow it down to one element, use the tag plus the prop you assigned it:
    const nav = wrapper.find("ul[data-test='nav']");
    expect(nav.children().length).toBe(2);
    expect(nav.text()).toContain("Sign In");
    expect(toJSON(nav)).toMatchSnapshot();
  });
  it("renders the full nav when signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <NavComponent />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find("ul[data-test='nav']");
    expect(nav.children().length).toBe(6);

    expect(nav.text()).toContain("Log Out");
    expect(nav.text()).toContain("Sell");
    expect(nav.text()).toContain("Account");
    expect(nav.text()).toContain("Orders");
    expect(nav.text()).toContain("My Cart");
  });
  it("renders the amount of items in the cart", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <NavComponent />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find("[data-test='nav']");
    const count = nav.find("div.count");
    expect(count.text()).toContain("9");
  });
});
