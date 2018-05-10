const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const appVersion = require('./package.json').version;
const os = require('os').platform();

let win
const electron = require('electron');
const squirrelUrl = "'http://localhost:3000/updates/latest'";

if (require('electron-squirrel-startup')) return;
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

//Other code

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(electron.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(electron.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};
const startAutoUpdater = (squirrelUrl) => {
// The Squirrel application will watch the provided URL
if (process.env.NODE_ENV !== 'development') {
    squirrelUrl = os === 'darwin' ?
      'https://macOSserver/updates/latest' : // just a placeholder
      'http://WindowsServer/releases/win32'; // just a placeholder
  }
  
electron.autoUpdater.setFeedURL(squirrelUrl + '?v=' + appVersion);

// Display a success message on successful update
electron.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
    electron.dialog.showMessageBox({"message": `The release ${releaseName} has been downloaded`});
});

// Display an error message on update error
electron.autoUpdater.addListener("error", (error) => {
    electron.dialog.showMessageBox({"message": "Auto updater error: " + error});
});

// tell squirrel to check for updates
electron.autoUpdater.checkForUpdates();
}
function createWindow () {
    if (process.env.NODE_ENV !== "dev") startAutoUpdater(squirrelUrl)

    win = new BrowserWindow({width: 900, height: 600})

    win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
    }))

    // win.webContents.openDevTools()
    // win.on('closed', () => {
    //   win = null
    // })
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
    app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
    createWindow()
    }
})
