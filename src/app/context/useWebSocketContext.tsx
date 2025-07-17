// ConnectionContext.tsx
import React, { createContext, useContext } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const WebSocketContext = createContext<ReturnType<typeof useWebSocket> | null>(
  null
);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const connection = useWebSocket();
  return (
    <WebSocketContext.Provider value={connection}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSharedWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error(
      "useSharedConnection must be used within a ConnectionProvider"
    );
  return context;
};
