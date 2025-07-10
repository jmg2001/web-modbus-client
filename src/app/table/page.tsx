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
      <h2 className=" mb-10 text-3xl font-bold">{typeRegister()} Registers:</h2>
      {Object.keys(modbusState.data).length > 0 ? (
        <div className="relative overflow-x-auto rounded-lg min-w-lg max-h-[50vh]">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="  text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">
                  Register #
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {modbusState.data[typeRegister()] &&
                modbusState.data[typeRegister()]
                  .at(-1)
                  .values.map((value, i) => (
                    <tr
                      key={i}
                      className="text-lg bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {i + startRegister()}
                      </th>
                      <td className="px-6 py-4 text-center">{value}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1>Waiting for Data</h1>
      )}
    </section>
  );
}
