import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import SingleItemComponent, {
  SINGLE_ITEM_QUERY,
} from "../components/SingleItem";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";

describe("<SingleItemComponent />", () => {
  it("renders with proper data", async () => {
    const mocks = [
      {
        //when someone makes a request with this query and variable combo:
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        //return this result:
        result: { data: { item: fakeItem() } },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItemComponent id="123" />
      </MockedProvider>
    );
    //initially, the call will be set at the "loading" phase because the data hasn't returned yet
    expect(wrapper.text()).toContain("Loading...");
    // wait() makes it so the next functions are called on the next tick, so after the data goes through. You also have to update the wrapper.
    await wait();
    wrapper.update();
    //don't snapshot the whole wrapper because the ApolloProvider will come along with it and it's loooong

    expect(toJSON(wrapper.find("h2"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
  });
  it.only("errors with a not found item", async () => {
    const mocks = [
      {
        request: { query: SINGLE_ITEM_QUERY, variables: { id: "123" } },
        //return this result, with errors inside:
        result: {
          errors: [{ message: "Item not found" }],
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItemComponent id="123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    //Wes put a prop of data-test to make it easier to find the elements we want in testing
    const item = wrapper.find("[data-test='graphql-error']");

    expect(item.text()).toContain("Item not found");
  });
});
