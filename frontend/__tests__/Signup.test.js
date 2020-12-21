import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import SignupComponent, { SIGNUP_MUTATION } from "../components/Signup";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";

function type(wrapper, name, value) {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate("change", { target: { name, value } });
}
const me = fakeUser();

const mocks = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: "password",
      },
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          id: "abc123",
          name: me.name,
          email: me.email,
          permissions: [],
          resetToken: "faketoken",
        },
      },
    },
  },
  {
    request: {
      query: CURRENT_USER_QUERY,
    },
    result: {
      data: {
        me,
      },
    },
  },
];

describe("<SignupComponent />", () => {
  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <SignupComponent />
      </MockedProvider>
    );
    const form = wrapper.find("form[data-test='form']");
    expect(toJSON(form)).toMatchSnapshot();
  });
  it("calls the mutation properly", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <SignupComponent />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    type(wrapper, "name", me.name);
    type(wrapper, "email", me.email);
    type(wrapper, "password", "password");
    wrapper.update();
    wrapper.find("form").simulate("submit");
    await wait();
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
