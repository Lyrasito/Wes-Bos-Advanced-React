import ItemComponent from "../components/Item";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

const fakeItem = {
  id: "fakeId",
  title: "Fake Item",
  description: "This item isn't real",
  price: 5000,
  image: "fake.jpg",
  largeImage: "largefake.jpg",
};

describe("<Item />", () => {
  it.only("renders and matches the snapshot", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  /*
  it("renders the title and price properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    // console.log(wrapper.debug()) will show all the html in the component
    //PriceTag is the <PriceTag>$50</PriceTag> component. It is only shallow rendered though. PriceTag.text() will only return <PriceTag />. You can use PriceTag.dive() to shallow mount one level deeper, and PriceTag.dive().text() will return $50. You can also use PriceTag.children()
    const PriceTag = wrapper.find("PriceTag");
    expect(PriceTag.dive().text()).toBe("$50");
    expect(PriceTag.children().text()).toBe("$50");
    //wrapper.find("Title a") will find the Title component and the a inside it.
    //you can use a.text() directly instead of .dive or .children because it is an html tag and not a component
    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
  });
  it("renders the image properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find("img");
    //if you want to find the src and alt of an img, use img.props(). This gives us an object with all the properties
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });
  it.only("renders the buttons properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find(".buttonList");
    expect(buttonList.children()).toHaveLength(3);
    console.log(buttonList.debug());
    //3 different ways you can check if children of an element are rendered
    expect(buttonList.find("Link")).toHaveLength(1);
    expect(buttonList.find("AddToCart").exists()).toBe(true);
    expect(buttonList.find("DeleteItem")).toBeTruthy();
  });
  */
});
