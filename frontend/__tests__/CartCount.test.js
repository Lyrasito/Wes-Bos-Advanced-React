import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import CartCountComponent from "../components/CartCount";

describe("<CartCount />", () => {
  xit("renders", () => {
    shallow(<CartCountComponent count={10} />);
  });
  xit("matches the snapshot", () => {
    const wrapper = shallow(<CartCountComponent count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  xit("updates via props", () => {
    const wrapper = shallow(<CartCountComponent count={50} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
