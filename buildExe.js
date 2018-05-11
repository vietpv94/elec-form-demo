var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './builds/electronformdemo-win32-x64',
    outputDirectory: './dist/installer',
    authors: 'Viet Pham',
    exe: 'electronformdemo.exe',
    setupMsi: 'electrondemo.msi',
    loadingGif:'./assets/gears.gif'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));