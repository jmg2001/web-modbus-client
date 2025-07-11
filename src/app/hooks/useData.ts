import { useReducer } from "react";

const initialData = { holding: {}, input: {}, coils: {} };

type dataActions = { type: "push-data"; payload: object };

export default function dataReducer(state = initialData, action: dataActions) {
  const { type, payload } = action;
  switch (type) {
    case "push-data":
      return state;
    default:
      return state;
  }
}

export function useData() {
  const [{ holding, input, coils }, dispatch] = useReducer(
    dataReducer,
    initialData
  );

  const pushData = () => {
    dispatch({ type: "push-data", payload: {} });
  };

  return {
    holding,
    input,
    coils,
    pushData,
  };
}
