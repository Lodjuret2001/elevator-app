import { useForm } from "react-hook-form";
import styled from "styled-components";
import elevatorService from "../services/elevator-service";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

const Input = styled.input`
  border: 2px solid #a5b4fc;
  border-radius: 5px;

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
  margin-left: 20px;
  padding: 2px 5px;
`;

interface Form {
  floor: string;
}

interface Props {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ElevatorForm = ({ setRefresh }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const [messageColor, setMessagecolor] = useState("black");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    const floors = data.floor.split(",").map((str) => parseInt(str));
    try {
      const results = await elevatorService.updateAll<string[]>(floors);
      setIsLoading(false);
      const resMessage = results.data.map((res, index) => (
        <p
          className="text-center"
          key={index}
          style={{ color: res.includes("arrived") ? "green" : "red" }}
        >
          {res}
        </p>
      ));
      setMessages(resMessage);
      setRefresh(true);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        setMessagecolor("red");
        setMessage(error.response?.data);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage("");
      setMessages([]);
    }, 5000);
    return () => clearInterval(interval);
  }, [message, messages]);

  return (
    <>
      <h2 className="mt-3 text-center">
        Test how this Elevator system handles multiple calls!
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex justify-center"
      >
        <Input
          {...register("floor", {
            required: true,
            pattern: {
              value: /^(?:[1-9]|10)(?:,(?:[1-9]|10))*$/,
              message:
                "Only valid floors (1-10) and seperate each floor call with a ,",
            },
          })}
          placeholder="1,2,3,10,5,6"
          type="type"
        />
        <Button type="submit">Make multiple floor calls!</Button>
      </form>
      {errors.floor && (
        <p className="text-red-800 text-center text-xs mt-3">
          {errors.floor.message}
        </p>
      )}
      {isLoading && (
        <div className=" mt-2 flex items-center justify-center">
          <svg
            className="h-4 animate-spin"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M96 256c0-26.5-21.5-48-48-48S0 229.5 0 256s21.5 48 48 48S96 282.5 96 256zM108.9 60.89c-26.5 0-48.01 21.49-48.01 47.99S82.39 156.9 108.9 156.9s47.99-21.51 47.99-48.01S135.4 60.89 108.9 60.89zM108.9 355.1c-26.5 0-48.01 21.51-48.01 48.01S82.39 451.1 108.9 451.1s47.99-21.49 47.99-47.99S135.4 355.1 108.9 355.1zM256 416c-26.5 0-48 21.5-48 48S229.5 512 256 512s48-21.5 48-48S282.5 416 256 416zM464 208C437.5 208 416 229.5 416 256s21.5 48 48 48S512 282.5 512 256S490.5 208 464 208zM403.1 355.1c-26.5 0-47.99 21.51-47.99 48.01S376.6 451.1 403.1 451.1s48.01-21.49 48.01-47.99S429.6 355.1 403.1 355.1zM256 0C229.5 0 208 21.5 208 48S229.5 96 256 96s48-21.5 48-48S282.5 0 256 0z" />
          </svg>
          <p>Waiting for elevators to arrive...</p>
        </div>
      )}
      {message && (
        <p style={{ color: messageColor }} className="text-center mt-2">
          {message}
        </p>
      )}
      {messages && <div className="mt-2">{messages}</div>}
    </>
  );
};

export default ElevatorForm;
