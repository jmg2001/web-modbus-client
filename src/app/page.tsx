"use client";

export default function Home() {
  return (
    <div className=" grid place-content-center mt-6 grid-cols-1 justify-items-center gap-2">
      <h1 className=" text-4xl font-bold">Welcome to Modbus TCP Web Client</h1>
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
      <p>Or init with saved (or default) parameters</p>
    </div>
  );
}
