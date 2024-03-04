import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import elevatorService, { Elevator } from "../services/elevator-service";
import { isAxiosError } from "axios";

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
`;

interface Form {
  [key: string]: number;
}

interface Props {
  elevators: Elevator[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ElevatorList = ({ setRefresh, elevators }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [messageColor, setMessagecolor] = useState("black");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = async (data: Form, id: number) => {
    let hasNumber = false;
    for (const key in data) {
      const value = Number(data[key]);
      if (value !== 0) {
        hasNumber = true;
        break;
      }
    }

    if (hasNumber) {
      try {
        const submissionData = {
          floor: data[`elevator-${id}`],
        };

        setIsLoading(true);
        const response = await elevatorService.updateOne<Elevator>(
          id,
          submissionData.floor
        );
        setIsLoading(false);
        const elevator = response.data;
        setMessagecolor("green");
        setMessage(
          `Elevator ${elevator.id} have arrived at floor ${elevator.currentFloor}!`
        );
        setRefresh(true);
      } catch (error) {
        setIsLoading(false);
        if (isAxiosError(error)) {
          console.log(error.response?.data);
          setMessagecolor("red");
          setMessage(error.response?.data);
        }
      }
    } else {
      setMessagecolor("red");
      setMessage("Submission was empty...");
      return;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage("");
    }, 5000);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <>
      <Container>
        <FlexBox>
          {elevators.map((e) => (
            <div key={e.id}>
              <p className="underline">ELEVATOR: {e.id}</p>
              <p>Current Floor: {e.currentFloor}</p>
              <p>Status: {e.status}</p>
              <p>Destination Floor: {e.destinationFloor}</p>

              <form
                key={e.id}
                onSubmit={handleSubmit((data) => onSubmit(data, e.id))}
                className="mt-2 h-20 flex flex-col justify-between border-2 border-indigo-300 p-2 w-4/6"
              >
                <Input
                  {...register(`elevator-${e.id}`, {
                    required: false,
                    min: {
                      value: 1,
                      message: "Floors that are valid is between 1-10",
                    },
                    max: {
                      value: 10,
                      message: "Floors that are valid is between 1-10",
                    },
                  })}
                  placeholder="Floor..."
                  type="number"
                />
                <Button type="submit">Move Elevator {e.id}</Button>
              </form>
              {errors?.[`elevator-${e.id}`] && (
                <p className="text-red-800 text-xs w-4/5">
                  {errors?.[`elevator-${e.id}`]?.message}
                </p>
              )}
            </div>
          ))}
        </FlexBox>
      </Container>
      {isLoading && (
        <div className=" mt-2 flex items-center justify-center">
          <svg
            className="h-4 animate-spin"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M96 256c0-26.5-21.5-48-48-48S0 229.5 0 256s21.5 48 48 48S96 282.5 96 256zM108.9 60.89c-26.5 0-48.01 21.49-48.01 47.99S82.39 156.9 108.9 156.9s47.99-21.51 47.99-48.01S135.4 60.89 108.9 60.89zM108.9 355.1c-26.5 0-48.01 21.51-48.01 48.01S82.39 451.1 108.9 451.1s47.99-21.49 47.99-47.99S135.4 355.1 108.9 355.1zM256 416c-26.5 0-48 21.5-48 48S229.5 512 256 512s48-21.5 48-48S282.5 416 256 416zM464 208C437.5 208 416 229.5 416 256s21.5 48 48 48S512 282.5 512 256S490.5 208 464 208zM403.1 355.1c-26.5 0-47.99 21.51-47.99 48.01S376.6 451.1 403.1 451.1s48.01-21.49 48.01-47.99S429.6 355.1 403.1 355.1zM256 0C229.5 0 208 21.5 208 48S229.5 96 256 96s48-21.5 48-48S282.5 0 256 0z" />
          </svg>
          <p>Waiting for elevator to arrive...</p>
        </div>
      )}
      {message && (
        <p style={{ color: messageColor }} className="text-center mt-2">
          {message}
        </p>
      )}
    </>
  );
};

export default ElevatorList;
