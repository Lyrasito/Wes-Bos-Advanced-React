import SingleItem from "../components/SingleItem";

const Item = (props) => (
  <div>
    <SingleItem id={props.query.id} />
    <p>Single item</p>
  </div>
);

export default Item;
