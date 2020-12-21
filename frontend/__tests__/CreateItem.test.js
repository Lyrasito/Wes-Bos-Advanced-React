import { mount } from "enzyme";
import wait from "waait";
import CreateItemComponent, {
  CREATE_ITEM_MUTATION,
} from "../components/CreateItem";
import toJSON from "enzyme-to-json";
import Router from "next/router";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";

//mock the global fetch api
const fakeImage = "https://fake.com/fake-image.jpg";

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: fakeImage,
    eager: [{ secure_url: fakeImage }],
  }),
});

describe("<CreateItemComponent />", () => {
  it("renders and matches snapshot", () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItemComponent />
      </MockedProvider>
    );
    const form = wrapper.find("form[data-test='form']");
    expect(toJSON(form)).toMatchSnapshot();
  });
  it("uploads a file when changed", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItemComponent />
      </MockedProvider>
    );
    const input = wrapper.find("input[type='file']");
    //simulate the file input change with any fake filename, which triggers the global fetch function, which we've mocked to return "https://fake.com/fake-image.jpg"
    input.simulate("change", { target: { files: ["fakeImage.jpg"] } });
    await wait();
    const component = wrapper.find("CreateItem").instance();
    expect(component.state.image).toEqual(fakeImage);
    expect(component.state.largeImage).toEqual(fakeImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });
  it("handles state updating", () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItemComponent />
      </MockedProvider>
    );
    const title = wrapper.find("#title");
    title.simulate("change", { target: { value: "Testing", name: "title" } });
    const price = wrapper.find("#price");
    price.simulate("change", {
      target: { value: 50000, name: "price", type: "number" },
    });
    const description = wrapper.find("#description");
    description.simulate("change", {
      target: { value: "Test description", name: "description" },
    });
    expect(wrapper.find("CreateItem").instance().state).toMatchObject({
      title: "Testing",
      price: 50000,
      description: "Test description",
    });
  });
  it("creates an item when the form is submitted", async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: "",
            largeImage: "",
            price: item.price,
          },
        },
        result: {
          data: {
            createItem: {
              ...item,
              id: "abc123",
              __typename: "Item",
            },
          },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItemComponent />
      </MockedProvider>
    );
    const title = wrapper.find("#title");
    title.simulate("change", { target: { value: item.title, name: "title" } });
    const price = wrapper.find("#price");
    price.simulate("change", {
      target: { value: item.price, name: "price", type: "number" },
    });
    const description = wrapper.find("#description");
    description.simulate("change", {
      target: { value: item.description, name: "description" },
    });
    Router.router = {
      push: jest.fn(),
    };
    wrapper.find("form").simulate("submit");
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/item",
      query: { id: "abc123" },
    });
  });
});
