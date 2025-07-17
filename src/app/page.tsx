"use client";

export default function Home() {
  return (
    <div className=" grid place-content-center mt-6 grid-cols-1 justify-items-center gap-2">
      <h1 className=" text-4xl font-bold">Welcome to Modbus TCP Web Client</h1>
      <div className=" mt-10 text-lg text-center">
        <p>
          This dashboard provides a centralized overview of system status and
          active communications. From here, you can navigate to configuration,
          data visualization, and monitoring tools to interact with your
          Modbus-compatible devices in real time.
        </p>
        {/* <p>
          For an initial test go to the{" "}
          <a className=" text-bold text-sky-600" href="/settings">
            Settings
          </a>{" "}
          page
        </p>
        <p>Or init with saved (or default) parameters</p> */}
      </div>
    </div>
  );
}
