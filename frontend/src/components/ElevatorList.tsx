import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import elevatorService, { Elevator } from "../services/elevator-service";
import { isAxiosError } from "axios";
import { Input, Button, Container, FlexBox, Img } from "../styles/formCss";
import loadingSvg from "../assets/loading.svg";

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
        setIsLoading(true);
        const submissionData = {
          floor: data[`elevator-${id}`],
        };

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
                style={{ height: "90px" }}
                key={e.id}
                onSubmit={handleSubmit((data) => onSubmit(data, e.id))}
                className="mt-2 flex flex-col justify-between items-center border-2 border-indigo-300 p-2 w-5/6"
              >
                <Input
                  className="w-full"
                  {...register(`elevator-${e.id}`, {
                    required: false,
                    min: {
                      value: 1,
                      message: "Floor must be atleast 1...",
                    },
                    max: {
                      value: 10,
                      message: "Floor can be max 10...",
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
          <Img src={loadingSvg} className="animate-spin" />
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
