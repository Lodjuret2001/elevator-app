import styled from "styled-components";
import elevatorService, { Elevator } from "../services/elevator-service";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";

const Input = styled.input`
  border: 2px solid #a5b4fc;
  border-radius: 5px;

  &:focus {
    outline: none;
    border: 2px solid indigo;
  }
`;

const Select = styled.select`
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
  status: string;
  destinationFloor: number;
}

interface Props {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  elevators: Elevator[];
}

const ElevatorStatus = ({ setRefresh, elevators }: Props) => {
  const [selectedElevator, setSelectedElevator] =
    useState<string>("Elevator 1");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedElevator(event.target.value);
  };

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    const id = parseInt(selectedElevator.split(" ")[1]);
    const result = await elevatorService.updateStatus<string>(id, data);
    setIsLoading(false);
    setMessage(result.data);
    setRefresh(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage("");
    }, 5000);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <>
      <div className="flex justify-center mt-3 flex-col items-center">
        <h2 className="mb-4">Update Elevator statuses manually</h2>
        <div style={{ width: "700px" }}>
          <form
            className=" flex justify-between items-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Select value={selectedElevator} onChange={handleSelectChange}>
              {elevators.map((elevator, index) => (
                <option key={index}>{`Elevator ${elevator.id}`}</option>
              ))}
            </Select>

            <Input
              {...register("status", {
                required: true,
                pattern: {
                  value: /^(idle|moving_up|moving_down)$/,
                  message: "Valid statuses: idle, moving_up, moving_down",
                },
              })}
              placeholder="Status..."
              type="text"
            />
            <Input
              {...register("destinationFloor", {
                required: true,
                min: {
                  value: 0,
                  message: "Minimum floor is 0...",
                },
                max: {
                  value: 10,
                  message: "Max floor is 10...",
                },
              })}
              placeholder="DestinationFloor..."
              type="number"
            />
            <Button type="submit">{`Update ${selectedElevator}`}</Button>
          </form>
        </div>
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
        {errors.status && (
          <p style={{ color: "red" }}>{errors.status.message}</p>
        )}
        {errors.destinationFloor && (
          <p style={{ color: "red" }}>{errors.destinationFloor.message}</p>
        )}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </>
  );
};

export default ElevatorStatus;
