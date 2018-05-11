const createDMG = require('electron-installer-dmg')

const opts = {
    "appPath" : "./builds/electron-form-demo-darwin-x64",
    "name" : "electron-form-demo"
}
createDMG(opts, function done (err) { })