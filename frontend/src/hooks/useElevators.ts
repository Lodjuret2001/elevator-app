import { useEffect, useState } from "react";
import elevatorService, { Elevator } from "../services/elevator-service";

const useElevators = () => {
  const [elevators, setElevators] = useState<Elevator[]>([]);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const { request, cancel } = elevatorService.getAll<Elevator>();
    request
      .then((res) => setElevators(res.data))
      .catch((err) => {
        console.log(err);
        setError(err.message);
        cancel();
      });
  }, []);

  useEffect(() => {
    const { request } = elevatorService.getAll<Elevator>();
    request
      .then((res) => {
        setElevators(res.data);
        setRefresh(false);
      })
      .catch((error) => console.log(error));
  }, [refresh]);

  return { elevators, setElevators, error, refresh, setRefresh };
};

export default useElevators;
