const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { ApiPromise } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
const lootTypes = require("../types.json");
const { cryptoWaitReady } = require("@polkadot/util-crypto");

let lootApi;
let userPair;
const keyring = new Keyring({ type: "sr25519", ss58Format: 2 });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = async () => {
  await cryptoWaitReady();
  await ApiPromise.create({
    types: lootTypes,
  }).then((api) => {
    win = new BrowserWindow({
      width: 1194,
      height: 834,
      webPreferences: {
        nodeIntegration: true,
        preload: __dirname + "/preload.js",
      },
    });

    lootApi = api;
  });

  userPair = keyring.addFromUri(
    "bottom drive obey lake curtain smoke basket hold race lonely fit walk//Bob",
    { name: "Alice" },
    "sr25519"
  );
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1194,
    height: 834,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + "/preload.js",
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("create-asset", async (event, args) => {
  lootApi.tx.lootNft
    .createNftClass(0, 0, args.price, args.royalty)
    .signAndSend(userPair, async ({ status, events, dispatchError }) => {
      // status would still be set, but in the case of error we can shortcut
      // to just check it (so an error would indicate InBlock or Finalized)
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(dispatchError.asModule);
          const { documentation, name, section } = decoded;
          console.log(`${section}.${name}: ${documentation.join(" ")}`);
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log(dispatchError.toString());
        }
      } else if (status.isInBlock) {
        event.reply("asset-created");
      }
    });
});
