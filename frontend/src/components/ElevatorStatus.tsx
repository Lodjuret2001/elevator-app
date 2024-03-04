import { Input, Select, Button, Img } from "../hooks/useFormCss";
import elevatorService, { Elevator } from "../services/elevator-service";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import loadingSvg from "../assets/loading.svg";
import { isAxiosError } from "axios";

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
    try {
      setIsLoading(true);
      const id = parseInt(selectedElevator.split(" ")[1]);
      const result = await elevatorService.updateStatus<string>(id, data);
      setIsLoading(false);
      setMessage(result.data);
      setRefresh(true);
    } catch (error) {
      setIsLoading(false);
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        setMessage(error.response?.data);
      }
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
      <div className="flex justify-center mt-3 flex-col items-center">
        <h2 className="mb-4">Update Elevator statuses manually</h2>
        <div style={{ width: "650px" }}>
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
            <Img src={loadingSvg} className="animate-spin" />
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
