"use client";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Home() {
  const { connectModbus } = useWebSocket("http://localhost:3001");

  return (
    <div className=" grid place-content-center mt-6 grid-cols-1 justify-items-center gap-2">
      <button
        onClick={() =>
          connectModbus(
            {
              ip: "localhost",
              interval: 1000,
              port: 502,
              registers: { type: "Holding", length: 2, start: 0 },
            },
            0.25
          )
        }
      >
        Click
      </button>
      {/* <h1 className=" text-4xl font-bold">Welcome to Modbus TCP Web Client</h1>
      <p className=" mt-10 text-xl">
        This a web tool for test Modbus TCP Servers and visualize the results in
        tables or charts.
      </p>
      <p>
        For an initial test go to the{" "}
        <a className=" text-bold text-sky-600" href="/settings">
          Settings
        </a>{" "}
        page
      </p>
      <p>Or init with saved (or default) parameters</p> */}
    </div>
  );
}
