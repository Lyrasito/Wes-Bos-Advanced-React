import { mount } from "enzyme";
import wait from "waait";
import RequestResetComponent, {
  REQUEST_RESET_MUTATION,
} from "../components/RequestReset";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: "marie@email.com" },
    },
    result: {
      data: {
        requestReset: {
          message: "success",
          __typename: "Message",
        },
      },
    },
  },
];

describe("<RequestResetComponent />", () => {
  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestResetComponent />
      </MockedProvider>
    );
    const form = wrapper.find("form[data-test='form']");
    expect(toJSON(form)).toMatchSnapshot();
  });
  it("calls the mutation", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestResetComponent />
      </MockedProvider>
    );
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: "marie@email.com" },
    });
    wrapper.find("form").simulate("submit");
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
  });
});
