var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './release/package/electron-form-demo-win32-x64',
    outputDirectory: './dist/installer',
    authors: 'Viet Pham',
    exe: 'electron-form-demo.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));