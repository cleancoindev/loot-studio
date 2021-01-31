import React, { useState } from "react";
import ReactDOM from "react-dom";
import Sidebar from "./Components/Sidebar";
import CreateView from "./Views/CreateView";
import AssetsView from "./Views/AssetsView";

function App() {
  const [screen, setScreen] = useState("create");
  return (
    <div id="app">
      <Sidebar screen={screen} setScreen={setScreen} />
      {screen == "create" ? <CreateView /> : null}
      {screen == "assets" ? <AssetsView /> : null}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
