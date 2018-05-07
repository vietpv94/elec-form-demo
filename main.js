const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win
const electron = require('electron');
const squirrelUrl = "http://localhost:3333";

const startAutoUpdater = (squirrelUrl) => {
// The Squirrel application will watch the provided URL
electron.autoUpdater.setFeedURL(`${squirrelUrl}/win64/`);

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

const handleSquirrelEvent = () => {
    if (process.argv.length === 1) {
        return false;
    }
    
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
        case '--squirrel-uninstall':
        setTimeout(app.quit, 1000);
        return true;
    
        case '--squirrel-obsolete':
        app.quit();
        return true;
    }
}
    
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}