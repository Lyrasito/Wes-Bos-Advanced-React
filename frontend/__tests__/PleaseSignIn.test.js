import { mount } from "enzyme";
import wait from "waait";
import PleaseSignInComponent from "../components/PleaseSignIn";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../lib/testUtils";

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

describe("<PleaseSignInComponent/>", () => {
  it("renders the log in dialogue for signed-out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignInComponent />
      </MockedProvider>
    );

    await wait();
    wrapper.update();

    expect(wrapper.text()).toContain("Please sign in to continue");
    expect(wrapper.find("SignIn")).toBeTruthy();
  });
  it("renders the child component when the user is signed in", async () => {
    const Child = () => <p>Look at me!</p>;
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignInComponent>
          <Child />
        </PleaseSignInComponent>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    //two ways to write the same thing:
    expect(wrapper.find("Child")).toBeTruthy();
    expect(wrapper.contains(<Child />)).toBe(true);
  });
});
