import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  padding: 10px;
  width: 600px;
  border: 5px solid purple;
  border-radius: 5px;
`;

const Input = styled.input`
  border: 2px solid #a5b4fc;
  border-radius: 5px;
  color: black;

  &:focus {
    outline: none;
    border: 2px solid indigo;
  }

  &::placeholder {
    color: black;
  }
`;

const Select = styled.select`
  border: 2px solid #a5b4fc;
  border-radius: 5px;
  color: black;
  &:focus {
    outline: none;
    border: 2px solid indigo;
  }
`;

const Button = styled.button`
  background-color: indigo;
  color: #fff;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  padding: 2px 5px;
  border: 2px solid indigo;

  &:hover {
    color: black;
    background-color: white;
  }
`;

const Img = styled.img`
  height: 25px;
  margin-right: 10px;
`;

export { Input, Select, Button, Container, FlexBox, Img };
