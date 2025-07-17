"use client";
import { useSharedWebSocket } from "../context/useWebSocketContext";

export default function TablePage() {
  const { modbusStatus, modbusDataBuffer } = useSharedWebSocket();

  return (
    <section className=" flex  h-full flex-col items-center">
      <h1 className="text-4xl font-bold mb-10">Table</h1>
      <p className="  w-4xl text-center mb-10">
        Tabular display of live Modbus data. Ideal for monitoring multiple
        registers simultaneously with precision. Values update in real time
        based on the configured polling frequency and provide a clear,
        structured view of all active tags.
      </p>
      {modbusDataBuffer.length > 0 ? (
        <>
          <div className=" flex items-center gap-4 mb-10">
            <h2 className=" text-3xl font-bold">
              {modbusStatus.registers.type} Registers -{" "}
            </h2>
            <h3 className="text-2xl">Example: </h3>
            <div className=" gap-3 w-fit text-lg flex p-2 bg-[#243347] border-2 border-[#4d6889] rounded-lg justify-between items-center">
              <h3 className="font-bold text-gray-900 whitespace-nowrap dark:text-white text-center">
                # Reg
              </h3>
              <p>|</p>
              <h4>Value</h4>
            </div>
            <p
              className={`${
                modbusStatus.connected ? "text-lime-500" : "text-red-400"
              }`}
            >
              {modbusStatus.connected ? "ONLINE" : "OFFLINE"}
            </p>
          </div>
          <div className=" grid gap-2 grid-flow-col grid-rows-6 auto-cols-fr  place-items-center">
            {modbusDataBuffer.at(-1) &&
              modbusDataBuffer.at(-1).values.map((value, i) => (
                <div
                  key={i}
                  className=" min-w-[10rem] gap-3 text-lg flex p-2 bg-[#243347] border-2 border-[#4d6889] rounded-lg justify-between items-center"
                >
                  <h3 className="font-bold text-gray-900 whitespace-nowrap dark:text-white text-center">
                    {(i + modbusStatus.registers.start)
                      .toString()
                      .padStart(4, "0")}{" "}
                    |
                  </h3>
                  <h4 className="">{value}</h4>
                </div>
              ))}
          </div>
        </>
      ) : (
        <h1>Waiting for Data</h1>
      )}
    </section>
  );
}
