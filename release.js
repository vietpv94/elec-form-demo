const os = require('os').platform()
const opts = {
  "appPath" : "./builds/electronformdemo-darwin-x64",
  "name" : "electron-form-demo"
}

if (os === 'darwin') {

  const createDMG = require('electron-installer-dmg')
  createDMG(opts, function done (err) {
    if (err) 
      console.log("ERROR: " + err);
  })
} else {
  const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
  const path = require('path')
  const rimraf = require('rimraf')
  deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

  function getInstallerConfig () {
    const outPath = path.join(__dirname, 'builds')
  
    return Promise.resolve({
      appDirectory: path.join(outPath, 'electronformdemo-win32-x64'),
      exe: 'electronformdemo.exe',    
      loadingGif:'./assets/gears.gif',
      noMsi: true,
      outputDirectory: path.join(outPath, 'windows-installer'),
      setupExe: 'ElectronFormDemoSetup.exe',
      setupIcon: path.join(__dirname, 'assets', 'app-icon', 'win', 'app.ico'),
      skipUpdateIcon: true
    })
  }
  
  function deleteOutputFolder () {
    return new Promise((resolve, reject) => {
      rimraf(path.join(__dirname, 'builds', 'windows-installer'), (error) => {
        error ? reject(error) : resolve()
      })
    })
  }
}

