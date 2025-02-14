import React, { useState } from "react";
import SimpleStorage from "./SimpleStorage";
import SendEtherWithTransaction from "./SendEther";

function App() {
  const [activeApp, setActiveApp] = useState("");

  const handleClick = (app) => {
    setActiveApp(app);
  };

  return (
    <div className="centered-container">
      <h1>Choose an App</h1>
      <div>
        <button
          style={{ margin: "10px" }}
          onClick={() => handleClick("counter")}
        >
          Counter app
        </button>
        <button
          style={{ margin: "10px" }}
          onClick={() => handleClick("sendEther")}
        >
          Send Ether app
        </button>
      </div>

      {activeApp === "counter" && <SimpleStorage />}
      {activeApp === "sendEther" && <SendEtherWithTransaction />}
    </div>
  );
}

export default App;
