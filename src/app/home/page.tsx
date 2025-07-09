"use client";

import { useEffect } from "react";
import { useModbusStore } from "../stores/useWebSocketStore";

export default function Page() {
  return (
    <div>
      <h1>Datos Modbus</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}
