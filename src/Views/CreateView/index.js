import React from "react";
import "./style.scss";

export default function Main() {
  const dropEvent = () => {
    document.getElementById("drop-file").innerHTML = "File Uploaded";
  };

  const createAsset = () => {
    const price = document.getElementById("price").value;
    const royalty = document.getElementById("royalty").value;

    window.ipcRenderer.send("create-asset", { price: price, royalty: royalty });
  };

  window.ipcRenderer.on("asset-created", () => {
    document.getElementById("price").value = null;
    document.getElementById("royalty").value = null;
    alert("Asset created!");
  });

  const dragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div id="create-view">
      <div id="create-form">
        <div
          id="drop-file"
          onDrop={() => dropEvent()}
          onDragOver={(e) => dragOver(e)}
        >
          Drop File Here
        </div>
        <input id="price" type="text" placeholder="price" />
        <input id="royalty" type="text" placeholder="royalty percentage" />
        <div id="create-button" onClick={() => createAsset()}>
          Create
        </div>
      </div>
    </div>
  );
}
