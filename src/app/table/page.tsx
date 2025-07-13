"use client";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export default function TablePage() {
  const modbusState = useWebSocketStore((s) => s.modbusState);
  const typeRegister = () => {
    if (Object.keys(modbusState.data).at(0))
      return Object.keys(modbusState.data).at(0);
  };
  const startRegister = () => {
    if (modbusState.registers) return +modbusState.registers["start"];
  };

  return (
    <section className=" flex  h-full flex-col items-center">
      <h1 className="text-4xl font-bold mb-10">Table</h1>

      <div className=" flex items-center gap-4 mb-10">
        <h2 className=" text-3xl font-bold">{typeRegister()} Registers - </h2>
        <h3 className="text-2xl">Example: </h3>
        <div className=" gap-3 w-fit text-lg flex p-2 bg-[#243347] border-2 border-[#4d6889] rounded-lg justify-between items-center">
          <h3 className="font-bold text-gray-900 whitespace-nowrap dark:text-white text-center">
            # Reg
          </h3>
          <p>|</p>
          <h4>Value</h4>
        </div>
      </div>
      {Object.keys(modbusState.data).length > 0 ? (
        <div className=" grid gap-2 grid-flow-col grid-rows-6 auto-cols-fr  place-items-center">
          {modbusState.data.at(-1) &&
            modbusState.data.at(-1).values.map((value, i) => (
              <div
                key={i}
                className=" min-w-[10rem] gap-3 text-lg flex p-2 bg-[#243347] border-2 border-[#4d6889] rounded-lg justify-between items-center"
              >
                <h3 className="font-bold text-gray-900 whitespace-nowrap dark:text-white text-center">
                  {(i + startRegister()).toString().padStart(4, "0")} |
                </h3>
                <h4 className="">{value}</h4>
              </div>
            ))}
        </div>
      ) : (
        <h1>Waiting for Data</h1>
      )}
    </section>
  );
}
