import useElevators from "./hooks/useElevators";
import ElevatorList from "./components/ElevatorList";
import ElevatorForm from "./components/ElevatorForm";
import ElevatorStatus from "./components/ElevatorStatus";

function App() {
  const { elevators, error, setRefresh } = useElevators();

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="font-bold text-4xl text-blue-400 text-center">
        Hello World!
      </h1>
      <ElevatorList elevators={elevators} setRefresh={setRefresh} />
      <ElevatorForm setRefresh={setRefresh} />
      <ElevatorStatus elevators={elevators} setRefresh={setRefresh} />
    </>
  );
}

export default App;
