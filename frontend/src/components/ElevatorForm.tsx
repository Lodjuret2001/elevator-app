import { useForm } from "react-hook-form";
import elevatorService from "../services/elevator-service";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Input, Button, Img } from "../hooks/useFormCss";
import loadingSvg from "../assets/loading.svg";

interface Form {
  floors: string;
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
    const floorsArray = data.floors.split(",").map((str) => parseInt(str));
    try {
      const results = await elevatorService.updateAll<string[]>(floorsArray);
      setIsLoading(false);
      const resMessage = results.data.map((res) => (
        <p
          className="text-center"
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
    }, 8000);
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
          {...register("floors", {
            required: true,
            pattern: {
              value: /^(?:[1-9]|10)(?:,(?:[1-9]|10))*$/,
              message:
                "Only valid floors (1-10) and seperate each floor call with a ,",
            },
          })}
          placeholder="1,2,3,10,5,6"
          type="text"
        />
        <Button type="submit">Make multiple floor calls!</Button>
      </form>
      {errors.floors && (
        <p className="text-red-800 text-center text-xs mt-3">
          {errors.floors.message}
        </p>
      )}
      {isLoading && (
        <div className=" mt-2 flex items-center justify-center">
          <Img src={loadingSvg} className="animate-spin" />
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
