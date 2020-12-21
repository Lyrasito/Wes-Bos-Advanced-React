import { mount } from "enzyme";
import wait from "waait";
import { ApolloConsumer } from "react-apollo";
import SigninComponent, { SIGNIN_MUTATION } from "../components/Signin";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";

const me = fakeUser();

function type(wrapper, name, value) {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate("change", { target: { name, value } });
}

const mocks = [
  {
    request: {
      query: SIGNIN_MUTATION,
      variables: {
        email: me.email,
        password: "password",
      },
    },

    result: {
      data: {
        signin: {
          ...me,
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

describe("<SigninComponent />", () => {
  it("renders and displays the component", () => {
    const wrapper = mount(
      <MockedProvider>
        <SigninComponent />
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
            return <SigninComponent />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    type(wrapper, "email", me.email);
    type(wrapper, "password", "password");
    const component = wrapper.find("Signin").instance();
    expect(component.state.email).toEqual(me.email);
    expect(component.state.password).toEqual("password");
    wrapper.update();
    wrapper.find("form").simulate("submit");
    await wait();
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(user.data.me).toMatchObject(me);
  });
});
