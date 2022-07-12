//Creación y lanzamiento de la ventana
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;


const createWindow = () => {
    const win = new BrowserWindow({
      width: 1024,
      height: 768,
      minWidth: 1024,
      minHeight: 768,
      frame: false,
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        enableRemoteModule: true,
        devTools: false,
        preload: path.join(__dirname, 'preload.js')
      }
    })

    win.loadFile('index.html');

    //Cerrar Ventana
    ipc.on('closeApp', () => {
      win.close();
    });

    //Mnimizar ventana
    ipc.on('minApp', () => {
      win.minimize();
    });

    //Maximizar ventana
    ipc.on('maxApp', () => {
      if(win.isMaximized()){
        win.restore();
      }else{
        win.maximize();
      }
    });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})