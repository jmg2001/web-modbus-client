import "./index.css";

import { Toaster } from "react-hot-toast";
import { WebSocketProvider } from "./context/useWebSocketContext";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Charts from "./pages/Charts";
import Settings from "./pages/Settings";
import Table from "./pages/Table";

import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";

function App() {
  return (
    <>
      <WebSocketProvider>
        <div className="flex h-screen bg-[#121921] text-white">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/charts" element={<Charts />} />
              <Route path="/table" element={<Table />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <StatusBar />
        </div>
        <Toaster position="top-right" reverseOrder={false} />
      </WebSocketProvider>
    </>
  );
}

export default App;
