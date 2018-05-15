const {app, BrowserWindow, autoUpdater, dialog, Menu} = require('electron');
const path = require('path');
const glob = require('glob');
const url = require('url');
const appVersion = require('./package.json').version;
const os = require('os').platform();
const dotenv = require('dotenv');

let win;
let state = 'checking';
let squirrelUrl = "http://localhost:8080/updates/";

/**
 * Load environment variables from .env file, there's some configurations for dev.
 */
dotenv.load({ path: '.env.dev' });

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
      spawnUpdate(['--createShortcut', exeName]);
      app.quit()
      return true;
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
    default:
      initialize()
  }
};
const startAutoUpdater = () => {

  squirrelUrl = os === 'darwin' ?
    'http://localhost:8080/updates/darwin/latest':
    'http://localhost:8080/updates/win32/latest';


  autoUpdater.setFeedURL(squirrelUrl + '?v=' + appVersion);

  // Display a success message on successful update
  autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
      dialog.showMessageBox({"message": `The release ${releaseName} has been downloaded`});
  });

  // Display an error message on update error
  autoUpdater.addListener("error", (error) => {
      dialog.showMessageBox({"message": "Auto updater error: " + error});
  });

  // tell squirrel to check for updates
  autoUpdater.checkForUpdates();
}
module.exports.startAutoUpdater = startAutoUpdater;

function createWindow () {

    win = new BrowserWindow({width: 900, height: 600})

    win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
    }));

    const debug = /--debug/.test(process.argv[2]);

    if (debug) {
      win.webContents.openDevTools()
      win.maximize()
      require('devtron').install()
    }
}

function initialize() {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
  app.on('ready', () => {
    createWindow();
    //startAutoUpdater(squirrelUrl)
  })
  
  app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
  })
  
  app.on('activate', () => {
      if (win === null) {
        createWindow();
      }
  })  
}
