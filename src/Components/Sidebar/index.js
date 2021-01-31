import React from "react";
import "./style.scss";

export default function Main(props) {
  const { screen, setScreen } = props;
  return (
    <div id="sidebar">
      <div id="top-links">
        <div
          className={screen == "assets" ? "selected" : ""}
          onClick={() => setScreen("assets")}
        >
          Assets
        </div>
        <div>Transactions</div>
        <div>Live View</div>
        <div>Profile</div>
      </div>
      <div id="bottom-links">
        <div
          className={screen == "create" ? "selected" : ""}
          onClick={() => setScreen("create")}
        >
          Create
        </div>
      </div>
    </div>
  );
}
