import styled from "styled-components";

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid ${(props) => props.theme.lightGrey};
  thead {
    font-size: 10px;
  }
  td,
  th {
    border-bottom: 1px solid ${(props) => props.theme.lightGrey};
    border-right: 1px solid ${(props) => props.theme.lightGrey};
    padding: 5px;
    position: relative;
    &:last-child {
      border-right: none;
      width: 150px;
      button {
        width: 100%;
      }
    }
    label {
      display: block;
      padding: 10px 5px;
    }
  }
  tr {
    &:hover {
      background: ${(props) => props.theme.lightGrey};
    }
  }
`;

export default Table;
