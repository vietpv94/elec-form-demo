const createDMG = require('electron-installer-dmg')

const opts = {
    "appPath" : "./release/electron-form-demo-darwin-x64/electron-form-demo.app",
    "name" : "electron-form-demo"
}
createDMG(opts, function done (err) { })